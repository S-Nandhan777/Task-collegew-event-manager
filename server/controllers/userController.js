const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO User (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.execute('SELECT * FROM User WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.user_id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
}

async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    const [rows] = await pool.execute('SELECT name, role FROM User WHERE user_id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ name: rows[0].name, role: rows[0].role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
    console.log(error);
    
  }
}

async function getUserDetails(req, res) {
  try {
    const userId = req.user.userId; // From JWT payload
    const [rows] = await pool.execute('SELECT name, role FROM User WHERE user_id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];
    res.json({ name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
}

module.exports = { register, login, getMe ,getUserDetails};