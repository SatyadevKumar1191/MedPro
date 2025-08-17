// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const patientsRouter = require('./routes/patients');
const doctorsRouter = require('./routes/doctors');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // replaces body-parser

// Connect to MongoDB
mongoose.connect('mongodb+srv://smart_dev:smart1234@cluster0.iz1hyr1.mongodb.net/')
  .then(() => console.log('✅ MongoDB connection established successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.use('/patients', patientsRouter);
app.use('/doctors', doctorsRouter);
app.use('/appointments', appointmentsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at url http://localhost:${PORT}`);
});
