const express = require('express');
const router = express.Router();
const { getEvents, getEventById, createEvent } = require('../controllers/eventController');
const { authenticateOrganizerToken } = require('../middleware/auth');

router.post('/create', authenticateOrganizerToken, createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById); 


module.exports = router;