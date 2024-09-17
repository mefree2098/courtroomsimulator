// routes/agent.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { interactWithAgent, issueSubpoena } = require('../controllers/agentController');

// Interact with an agent
router.post('/agent/interact', authMiddleware, interactWithAgent);

// Issue a subpoena to an agent
router.post('/agent/subpoena', authMiddleware, issueSubpoena);

module.exports = router;
