const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');
const { getAll, add } = require('../controllers/photoController');

router.get('/:id', authenticateToken, getAll);
router.post('/', authenticateToken, add);

module.exports = router;