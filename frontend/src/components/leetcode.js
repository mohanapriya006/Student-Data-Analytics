//client\src\components\leetcode.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './leetcode.css';

function Leetcode() {
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [sortOrder, setSortOrder] = useState('desc');
  const [departments, setDepartments] = useState([]);
  const [batches, setBatches] = useState([]);
  const [lcRangeData, setLcRangeData] = useState([]);
  const [search, setSearch] = useState('');

  const getLcRangeData = (students) => {
    const ranges = [
      { label: '0-49', min: 0, max: 49 },
      { label: '50-99', min: 50, max: 99 },
      { label: '100-149', min: 100, max: 149 },
      { label: '150-199', min: 150, max: 199 },
      { label: '200+', min: 200, max: Infinity }
    ];

    return ranges.map(range => ({
      range: range.label,
      count: students.filter(s => s.lc >= range.min && s.lc <= range.max).length
    }));
  };

  useEffect(() => {
    axios.get('http://localhost:5000/students/departments')
      .then(res => setDepartments(res.data))
      .catch(err => console.error('Error fetching departments:', err));

    axios.get('http://localhost:5000/students/batches')
      .then(res => setBatches(res.data))
      .catch(err => console.error('Error fetching batches:', err));
  }, []);

  useEffect(() => {
    const params = {};
    if (department) params.department = department;
    if (batch) params.batch = batch;
    params.sort = sortOrder;
    if (search) params.search = search;

    axios.get('http://localhost:5000/students', { params })
      .then(res => {
        setStudents(res.data);
        setLcRangeData(getLcRangeData(res.data));
      })
      .catch(err => console.error('Error fetching students:', err));
  }, [department, batch, sortOrder, search]);

  return (
    <div className="dashboard-container">
      <h1>📊 LeetCode Dashboard</h1>

      <div className="controls">
        <label>
          Department
          <select value={department} onChange={e => setDepartment(e.target.value)}>
            <option value="">All</option>
            {departments.map((d, i) => <option key={i} value={d}>{d}</option>)}
          </select>
        </label>

        <label>
          Batch
          <select value={batch} onChange={e => setBatch(e.target.value)}>
            <option value="">All</option>
            {batches.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>
        </label>

        <label>
          Sort
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>

        <input
          type="text"
          placeholder="Search by name or LC ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="charts">
        <ResponsiveContainer width="48%" height={300}>
  <BarChart data={students}>
    <XAxis dataKey="name" tick={false} axisLine={false} tickLine={false} />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="lc" fill="#1f77b4" />
  </BarChart>
</ResponsiveContainer>

        <ResponsiveContainer width="48%" height={300}>
          <BarChart data={lcRangeData}>
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#ff7f0e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="styled-table">
  <thead>
    <tr>
      <th>S.No</th>
      <th>Name</th>
      <th>LeetCode ID</th>
      <th>LC Count</th>
    </tr>
  </thead>
  <tbody>
    {students.length === 0 ? (
      <tr><td colSpan="4">No student data found.</td></tr>
    ) : (
      students.map((s, i) => (
        <tr key={i}>
          <td>{i + 1}</td> {/* Serial Number */}
          <td>{s.name}</td>
          <td>{s.lc_id}</td>
          <td>{s.lc}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
}

export default Leetcode;