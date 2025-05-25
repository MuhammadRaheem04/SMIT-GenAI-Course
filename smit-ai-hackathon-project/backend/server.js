// backend/server.js

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const registerRoutes = require('./routes/register');
const generateCardRoute = require('./routes/generateCard'); 
require('dotenv').config();

const app = express(); // ✅ app must be defined first!
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', registerRoutes);
app.use('/generateCard', generateCardRoute); // ✅ Now this is correctly placed

// Health check route
app.get('/health', (req, res) => {
  res.json({ message: 'Saylani Registration API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/health`);
});
