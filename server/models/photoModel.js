const pool = require('../config/db');

async function getPhotosByEventId(eventId) { // Fixed parameter name
  const [rows] = await pool.execute(
    'SELECT * FROM Photo WHERE event_id = ?',
    [eventId]
  );
  return rows;
}

async function addPhoto(eventId, photoUrl) { // Fixed parameter name
  const [result] = await pool.execute(
    'INSERT INTO Photo (event_id, photo_url) VALUES (?, ?)',
    [eventId, photoUrl]
  );
  return result.insertId;
}

module.exports = {
  getPhotosByEventId, // Renamed to match controller
  addPhoto
};