const { getOrganizerById } = require('../models/organizerModel');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
require('dotenv').config();



async function getById(req, res) {
  try {
      const organizer = await getOrganizerById(req.params.id);
      if (!organizer) return res.status(404).json({ error: 'Organizer not found' });
      res.json(organizer);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch organizer' });
  }
}

async function registerOrganizer(req, res) {
  try {
    const { name, email, password,description } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO Organizer (name, contact_info, password,description) VALUES (?, ?, ?,?)',
      [name, email, hashedPassword,description]
    );
    res.status(201).json({ message: 'Organizer registered' },{result});
    
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    console.log(error);
    
  }
}


async function loginOrganizer(req, res) {
  try {
    const { email, password,role } = req.body;
    const [rows] = await pool.execute('SELECT * FROM Organizer WHERE contact_info = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const organizer = rows[0];
    const match = await bcrypt.compare(password, organizer.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ organizerId: organizer.organizer_id, email: organizer.contact_info, role: role,organizerName:organizer.organizerName }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
    console.log(role);
    console.log(token);
    
    
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
    console.log(error);
    
  }
}

module.exports = {
  getById,
  registerOrganizer,
  loginOrganizer
}