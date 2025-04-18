const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { checkRegistration, registerForEvent, cancelRegistration, getMyEvents } = require('../controllers/registrationController');

router.get('/check/:id',authenticateToken, checkRegistration);
router.post('/',authenticateToken, registerForEvent);
router.delete('/:id', authenticateToken, cancelRegistration);
router.get('/my-events', authenticateToken, getMyEvents);


module.exports = router;