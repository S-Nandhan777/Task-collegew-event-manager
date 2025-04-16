const pool = require('../config/db');

async function addReview(userId, eventId, rating, reviewText) {
  const [result] = await pool.execute(
      'INSERT INTO Review (user_id, event_id, rating, review_text) VALUES (?, ?, ?, ?)',
      [userId, eventId, rating, reviewText]
  );
  return result.insertId;
}

async function getReviewsByEventId(eventId) {
  const [rows] = await pool.execute(
      'SELECT r.*, u.name FROM Review r JOIN User u ON r.user_id = u.user_id WHERE r.event_id = ?',
      [eventId]
  );
  return rows;
}


module.exports = {
  addReview,
  getReviewsByEventId
  
}