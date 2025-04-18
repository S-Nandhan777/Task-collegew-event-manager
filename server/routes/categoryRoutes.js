const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { getAll } = require('../controllers/categoryController');

router.get('/', authenticateToken, getAll);
module.exports = router;