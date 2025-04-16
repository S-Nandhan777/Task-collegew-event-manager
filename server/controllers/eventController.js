const pool = require('../config/db');

async function getEvents(req, res) {
  try {
    const [rows] = await pool.execute('SELECT * FROM Event');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' });
  }
}

async function getEventById(req, res) {
  try {
    const { id } = req.params;
    console.log(`Fetching event with ID: ${id}`); // Debug
    const [rows] = await pool.execute('SELECT * FROM Event WHERE event_id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event' });
  }
}

async function createEvent(req, res) {
  try {
    const { title, date, time, location, description, category_id, organizer_name } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO Event (title, date, time, location, description, category_id, organizer_name) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, date, time, location, description, category_id, organizer_name]
    );
    res.status(201).json({ message: 'Event created', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Event creation failed' });
  }
}

module.exports = { getEvents, getEventById, createEvent };