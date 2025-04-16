const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { checkRegistration, registerForEvent, cancelRegistration } = require('../controllers/registrationController');

router.get('/check/:id', authenticateToken, checkRegistration);
router.post('/', authenticateToken, registerForEvent);
router.delete('/:id', authenticateToken, cancelRegistration);

module.exports = router;