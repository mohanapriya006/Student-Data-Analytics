const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 5000;

// Import your route modules
const studentRoutes = require('./routes/studentRoutes');         
const lcRoutes = require('./routes/students');                    
const overallStudentRoutes = require('./routes/overallStudentRoutes'); 

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use('/', overallStudentRoutes);      
app.use('/api/students', studentRoutes); 
app.use('/students-lc', lcRoutes);     

app.get('/test', (req, res) => {
  res.json({ message: 'Server is working correctly!' });
});
app.get('/', (req, res) => {
  res.send('CGPA Ranking API is running. Use /api/students/cgpa-ranking or /students to access data.');
});

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
  console.log(`Test the API at: http://localhost:${PORT}/test`);
});
