const pool = require('../config/db');

async function checkRegistration(req, res) {
  
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const [rows] = await pool.execute(
      'SELECT * FROM Registration WHERE user_id = ? AND event_id = ?',
      [userId, id]
    );
    res.json({ registered: rows.length > 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to check registration' });
    console.log(error);
    
  }
}

async function registerForEvent(req, res) {
  try {
    console.log(req.body);
    
    const { event_id } = req.body;
    const userId = req.user.userId;
    const [result] = await pool.execute(
      'INSERT INTO Registration (user_id, event_id) VALUES (?, ?)',
      [userId, event_id]
    );
    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
    console.log(error);

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
    console.log(error);
  }
}

module.exports = { checkRegistration, registerForEvent, cancelRegistration };