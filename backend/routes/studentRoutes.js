const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
router.get('/cgpa-ranking', studentController.getStudentsByCGPARanking);
module.exports = router;


