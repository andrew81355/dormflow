// this file iis for handling routes for authentication these are register and login
const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middleware/auth');
router.post('/register', register);
router.post('/login', login);
//get user data with token, first is auth middleware
router.get('/me', auth, me);
module.exports = router;