// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  winLossRecord: {
    wins:   { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
  },
  caseSummaries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseSummary' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
