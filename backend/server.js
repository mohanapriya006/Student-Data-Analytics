// Fixed server.js
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
app.use(cors()); 
// Middleware
app.use(express.json());

// Load routes
const studentRoutes = require('./routes/studentRoutes');
const lcRoutes = require('./routes/students');

// Mount routes - Use a simple string pattern instead of a complex pattern
app.use('/api/students', studentRoutes);
app.use('/students', lcRoutes);

// Simple test route directly in server.js to test if it works
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working correctly!' });
});

// Root route
app.get('/', (req, res) => {
  // Simplified response for testing
  res.send('CGPA Ranking API is running. Use /api/students/cgpa-ranking to access data.');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/test`);

});