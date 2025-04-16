const { getRemindersByUserId, setReminder } = require('../models/reminderModel');


async function getReminders(req, res) {
  try {
      const reminders = await getRemindersByUserId(req.user.userId);
      res.json(reminders);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reminders' });
  }
}


async function setReminderTime(req, res) {
  try {
      const { event_id, reminder_time } = req.body;
      const userId = req.user.userId;
      const success = await setReminder(userId, event_id, reminder_time);
      if (!success) return res.status(400).json({ error: 'Failed to set reminder' });
      res.json({ message: 'Reminder set' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to set reminder' });
  }
}

module.exports = {
  getReminders,
  setReminderTime
  
}