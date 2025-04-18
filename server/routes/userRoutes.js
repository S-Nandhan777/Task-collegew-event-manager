const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { register, login, getMe,getUserDetails } = require('../controllers/userController');

// console.log('register:', typeof register);
// console.log('login:', typeof login);
// console.log('getMe:', typeof getMe);
// console.log('auth:', typeof authenticateToken);


router.post('/register', register);
router.post('/login', login);
// router.get('/me', authenticateToken, getMe);
router.get('/me', authenticateToken, getUserDetails);



module.exports = router;