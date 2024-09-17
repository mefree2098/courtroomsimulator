// routes/case.js

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  generateCase,
  concludeCase,
  getCaseAgents,
  getCaseSummaries,
} = require('../controllers/caseController');

// Generate a new case
router.post('/case/generate', authMiddleware, generateCase);

// Conclude a case
router.post('/case/conclude', authMiddleware, concludeCase);

// Get agents for a case
router.get('/case/:caseId/agents', authMiddleware, getCaseAgents);

// Get case summaries for the user
router.get('/case/summary', authMiddleware, getCaseSummaries);

module.exports = router;
