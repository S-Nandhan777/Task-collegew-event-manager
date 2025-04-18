const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { checkRegistration, registerForEvent, cancelRegistration } = require('../controllers/registrationController');

router.get('/check/:id', checkRegistration);
router.post('/', registerForEvent);
router.delete('/:id', cancelRegistration);

module.exports = router;