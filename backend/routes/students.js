const express = require('express');
const router = express.Router();
const pool = require('../db/connection'); 
router.get('/', async (req, res) => {
  const { department, batch, sort = 'desc', search } = req.query;
  let query = 'SELECT name, lc_id, lc FROM students WHERE 1=1';
  const values = [];
  if (department) {
    values.push(department);
    query += ` AND department = $${values.length}`;
  }
  if (batch) {
    values.push(batch);
    query += ` AND ending_year = $${values.length}`;
  }
  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    query += ` AND (LOWER(name) LIKE $${values.length} OR LOWER(lc_id) LIKE $${values.length})`;
  }

  query += ` ORDER BY lc ${sort.toUpperCase()}`;

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Query failed:', err);
    res.status(500).send('Server error');
  }
});


router.get('/departments', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT department FROM students');
    const departments = result.rows.map(row => row.department);
    res.json(departments);
  } catch (err) {
    console.error('Failed to fetch departments:', err);
    res.status(500).send('Server error');
  }
});

router.get('/batches', async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT ending_year FROM students ORDER BY ending_year DESC');
    const batches = result.rows.map(row => row.ending_year);
    res.json(batches);
  } catch (err) {
    console.error('Failed to fetch batches:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;