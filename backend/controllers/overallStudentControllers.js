// controllers/overallStudentControllers.js
const pool = require('../db/connection');

// Get all students, optionally filtered by department
const getAllStudents = async (req, res) => {
  const { department } = req.query;

  try {
    let result;

    if (department && department !== 'All') {
      result = await pool.query(
        'SELECT * FROM students WHERE department = $1 ORDER BY cgpa DESC',
        [department]
      );
    } else {
      result = await pool.query(
        'SELECT * FROM students ORDER BY cgpa DESC'
      );
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error retrieving students:", err.message);
    res.status(500).json({ error: 'Server error while fetching students.' });
  }
};

module.exports = {
  getAllStudents
};
