// models/Agent.js

const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  characterName: String,
  role: String, // e.g., 'victim', 'witness', 'accused', 'judge', 'jury', 'defense attorney', 'prosecutor'
  conversationHistory: [
    {
      role: { type: String, enum: ['user', 'assistant'] },
      content: String,
    },
  ],
  subpoenaed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Agent', AgentSchema);
