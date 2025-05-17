// Create this file at backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

// Route to get students filtered by department and year range, ranked by CGPA
router.get('/cgpa-ranking', studentController.getStudentsByCGPARanking);

module.exports = router;