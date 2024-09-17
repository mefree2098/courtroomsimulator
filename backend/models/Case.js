// models/Case.js

const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['prosecutor', 'defense'], required: true },
  caseDetails: {
    crime: String,
    victims: [String],
    villain: String,
    arrestedPerson: String,
    evidence: [String],
  },
  preTrialData: {
    interactions: [Object],
    subpoenas: [String],
  },
  trialData: {
    courtInteractions: [Object],
    objections: [Object],
    judgeRulings: [Object],
  },
  verdict: { type: String, enum: ['guilty', 'not guilty'] },
  actualOutcome: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Case', CaseSchema);
