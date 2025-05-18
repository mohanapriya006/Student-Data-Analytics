const pool = require('../db/connection');
const studentController = {
  getStudentsByCGPARanking: async (req, res) => {
    try {
      const { department, startingYear, endingYear, sortOrder = 'DESC' } = req.query;
      let query = `
        SELECT name, rno, cgpa
        FROM students
        WHERE 1=1
      `;
      const queryParams = [];
      let paramIndex = 1;
      if (department && department !== 'All') {
        query += ` AND department = $${paramIndex}`;
        queryParams.push(department);
        paramIndex++;
      }
      if (startingYear) {
        query += ` AND starting_year = $${paramIndex}`;
        queryParams.push(parseInt(startingYear));
        paramIndex++;
      }
      if (endingYear) {
        query += ` AND ending_year = $${paramIndex}`;
        queryParams.push(parseInt(endingYear));
        paramIndex++;
      }
      const validSortOrder = ['ASC', 'DESC'].includes(sortOrder.toUpperCase()) 
        ? sortOrder.toUpperCase() 
        : 'DESC';
      query += ` ORDER BY cgpa ${validSortOrder} NULLS LAST`;
      const { rows } = await pool.query(query, queryParams);
      
      // Get statistical data for the graph
      const stats = await getStatisticalData(department, startingYear, endingYear);
      
      return res.status(200).json({
        success: true,
        data: rows,
        stats
      });
    } catch (error) {
      console.error('Error fetching student CGPA ranking:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

async function getStatisticalData(department, startingYear, endingYear) {
  try {

    let query = `
      SELECT 
        CASE 
          WHEN cgpa >= 9.0 THEN '9.0-10.0'
          WHEN cgpa >= 8.0 THEN '8.0-8.9'
          WHEN cgpa >= 7.0 THEN '7.0-7.9'
          WHEN cgpa >= 6.0 THEN '6.0-6.9'
          ELSE 'Below 6.0'
        END as cgpa_range,
        COUNT(*) as count
      FROM students
      WHERE cgpa IS NOT NULL
    `;
    
    const queryParams = [];
    let paramIndex = 1;
    
    if (department && department !== 'All') {
      query += ` AND department = $${paramIndex}`;
      queryParams.push(department);
      paramIndex++;
    }
    
    if (startingYear) {
      query += ` AND starting_year = $${paramIndex}`;
      queryParams.push(parseInt(startingYear));
      paramIndex++;
    }
    
    if (endingYear) {
      query += ` AND ending_year = $${paramIndex}`;
      queryParams.push(parseInt(endingYear));
      paramIndex++;
    }
    
    query += ` GROUP BY cgpa_range ORDER BY cgpa_range DESC`;
    
    const { rows } = await pool.query(query, queryParams);
    return rows;
  } catch (error) {
    console.error('Error fetching CGPA statistics:', error);
    return [];
  }
}

module.exports = studentController;