const express = require('express');
const { registerUser } = require('../controllers/registerController');

const router = express.Router();

// POST /api/register - Handle user registration
router.post('/register', registerUser);

module.exports = router;