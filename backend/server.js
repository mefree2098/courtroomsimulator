// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/case');
const agentRoutes = require('./routes/agent');
const trialRoutes = require('./routes/trial');

// Middleware
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true, // Uncomment if using mongoose <6.x
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', authRoutes);
app.use('/api', caseRoutes);
app.use('/api', agentRoutes);
app.use('/api', trialRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
