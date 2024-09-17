// models/CaseSummary.js

const mongoose = require('mongoose');

const CaseSummarySchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verdict: { type: String, enum: ['guilty', 'not guilty'] },
  actualOutcome: String,
  summaryText: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CaseSummary', CaseSummarySchema);
