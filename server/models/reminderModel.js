const pool = require('../config/db');

async function getRemindersByUserId(userId) {
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);
  const [rows] = await pool.execute(
      'SELECT r.*, e.title, e.date, e.time FROM Reminder r JOIN Event e ON r.event_id = e.event_id WHERE r.user_id = ? AND e.date BETWEEN CURDATE() AND ?',
      [userId, twoWeeksLater.toISOString().split('T')[0]]
  );
  return rows;
}

async function setReminder(userId, eventId, reminderTime) {
  const [result] = await pool.execute(
      'INSERT INTO Reminder (user_id, event_id, reminder_time) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE reminder_time = ?',
      [userId, eventId, reminderTime, reminderTime]
  );
  return result.affectedRows > 0;
}


module.exports = {
  getRemindersByUserId,
  setReminder
}