// routes/overallStudentRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentsByDepartment
} = require('../controllers/overallStudentControllers');

// Route to get all students (with optional department filter)
router.get('/students', getAllStudents);

module.exports = router;