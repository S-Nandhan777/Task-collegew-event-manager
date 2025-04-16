const pool = require('../config/db');

async function checkRegistration(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId; // From authenticateToken
    const [rows] = await pool.execute(
      'SELECT * FROM Registration WHERE user_id = ? AND event_id = ?',
      [userId, id]
    );
    res.json({ registered: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check registration' });
  }
}

async function registerForEvent(req, res) {
  try {
    const { event_id } = req.body;
    const userId = req.user.userId;
    const [result] = await pool.execute(
      'INSERT INTO Registration (user_id, event_id) VALUES (?, ?)',
      [userId, event_id]
    );
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
}

async function cancelRegistration(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    await pool.execute(
      'DELETE FROM Registration WHERE user_id = ? AND event_id = ?',
      [userId, id]
    );
    res.json({ message: 'Registration cancelled' });
  } catch (error) {
    res.status(500).json({ error: 'Cancellation failed' });
  }
}

module.exports = { checkRegistration, registerForEvent, cancelRegistration };