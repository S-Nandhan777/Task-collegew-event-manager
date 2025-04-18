const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { add, getByEventId } = require('../controllers/reviewController');

router.post('/', authenticateToken, add);
router.get('/:id', authenticateToken, getByEventId);

module.exports = router;