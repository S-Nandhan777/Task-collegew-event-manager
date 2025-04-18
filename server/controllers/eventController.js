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
    const { title, date, time, location, description, eventId } = req.body;
    const organizerId = req.organizer;
    console.log("Organizer ID from middleware:", organizerId);
    console.log(`Tilte: ${title}, Date: ${date}, Time: ${time}, Location: ${location}, Description: ${description}, Organizer ID: ${organizerId} `); // Debug
    
    const [result] = await pool.execute(
      'INSERT INTO Event (event_id,title, date, time, location, description, organizer_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [eventId,title, date, time, location, description, organizerId]
    );
    res.status(201).json({ message: 'Event created', eventId: result.insertId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Event creation failed' });
  }
}

module.exports = { getEvents, getEventById, createEvent };