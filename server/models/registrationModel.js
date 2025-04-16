const pool = require('../config/db');

async function registerUserForEvent(userId, eventId) {
  const [result] = await pool.execute(
    'INSERT INTO Registration (user_id, event_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE register_id=register_id',
    [userId, eventId]
  );
  return result.affectedRows > 0;
}


async function cancelRegistration(userId, eventId) {
  const [result] = await pool.execute(
      'DELETE FROM Registration WHERE user_id = ? AND event_id = ?',
      [userId, eventId]
  );
  return result.affectedRows > 0;
}


async function getUserEvents(userId) {
  const [rows] = await pool.execute(
      'SELECT e.* FROM Event e JOIN Registration r ON e.event_id = r.event_id WHERE r.user_id = ? ORDER BY e.date, e.time',
      [userId]
  );
  return rows;
}


module.exports = {
  registerUserForEvent,
  cancelRegistration,
  getUserEvents
}
