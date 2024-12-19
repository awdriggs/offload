import dotenv from 'dotenv';
dotenv.config(); // setup envirnoment variables
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes.js';
import agentRoutes from './routes/agentRoutes.js';
// import webhookRoutes from './routes/webhookRoutes.js'; //not using! keeping for reference

import connectDB from './config/db.js';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the 'public' folder

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
// app.use('/webhook', webhookRoutes);

import path from 'path';

app.get('/agent/:id', (req, res) => {
  res.sendFile(path.resolve('public/agent.html'));
});

// Database Connection
connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 








