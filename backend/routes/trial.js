// routes/trial.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { handleObjection } = require('../controllers/trialController');

// Handle an objection during trial
router.post('/trial/objection', authMiddleware, handleObjection);

module.exports = router;
