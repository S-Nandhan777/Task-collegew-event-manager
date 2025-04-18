const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getReminders, setReminderTime } = require('../controllers/reminderController');

router.get('/', authenticateToken, getReminders);
router.post('/', authenticateToken, setReminderTime);

module.exports = router;