const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getById,registerOrganizer, loginOrganizer } = require('../controllers/organizerController');

router.get('/:id', authenticateToken, getById);
// router.post('/login', loginOrganizer);
router.post('/register', registerOrganizer);

router.post('/login', loginOrganizer);

module.exports = router;