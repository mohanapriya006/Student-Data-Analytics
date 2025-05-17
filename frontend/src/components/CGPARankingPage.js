import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const CGPARankingPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    department: '',
    startingYear: '',
    endingYear: '',
    sortOrder: 'DESC'
  });
  const [stats, setStats] = useState([]);

  const departments = ['All', 'CSBS', 'CSE', 'IT', 'VLSI', 'BM', 'AIML', 'AIDS'];

  const startingYearOptions = [];
  for (let year = 2010; year <= 2025; year++) {
    startingYearOptions.push(year);
  }

  const endingYearOptions = [];
  for (let year = 2014; year <= 2030; year++) {
    endingYearOptions.push(year);
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleSortOrder = () => {
    setFilters(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'DESC' ? 'ASC' : 'DESC'
    }));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const { department, startingYear, endingYear, sortOrder } = filters;

      const response = await axios.get('/api/students/cgpa-ranking', {
        params: {
          department: department === 'All' ? '' : department,
          startingYear,
          endingYear,
          sortOrder
        }
      });

      setStudents(response.data.data || []);
      setStats(response.data.stats || []);
    } catch (err) {
      setError('Error fetching data. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };


  const applyFilters = (e) => {
    e.preventDefault();
    fetchData();
  };

  const chartData = stats.map(item => ({
    name: item.cgpa_range,
    students: parseInt(item.count)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9370DB', '#FF6B6B', '#4BC0C0'];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f9f9ff',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    },
    header: {
      textAlign: 'center',
      color: '#3730a3',
      marginBottom: '30px',
      fontSize: '32px',
      fontWeight: 'bold',
      textShadow: '1px 1px 3px rgba(0,0,0,0.1)'
    },
    filterSection: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '15px',
      padding: '20px',
      marginBottom: '30px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    },
    filterGroup: {
      minWidth: '150px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#4338ca'
    },
    select: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #cbd5e1',
      backgroundColor: 'white',
      transition: 'all 0.3s ease'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    },
    applyButton: {
      backgroundColor: '#4f46e5',
      color: 'white',
      border: 'none',
      boxShadow: '0 4px 6px rgba(66, 153, 225, 0.5)',
      minWidth: '120px'
    },
    sortButton: {
      backgroundColor: '#e0e7ff',
      color: '#4338ca',
      border: '1px solid #4338ca'
    },
    chartsContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      marginBottom: '30px',
      flexWrap: 'wrap'
    },
    chartBox: {
      flex: '1 1 calc(50% - 10px)',
      minWidth: '300px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      padding: '20px',
      border: '1px solid #e2e8f0'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '600',
      marginBottom: '15px',
      color: '#4338ca',
      textAlign: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    tableHead: {
      backgroundColor: '#4338ca',
      color: 'white'
    },
    tableHeadCell: {
      padding: '15px',
      textAlign: 'left',
      fontWeight: '600'
    },
    tableRow: {
      borderBottom: '1px solid #e2e8f0',
      transition: 'background-color 0.3s ease'
    },
    tableCell: {
      padding: '12px 15px'
    },
    tableCellCGPA: {
      padding: '12px 15px',
      fontWeight: '600',
      color: '#4f46e5'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    spinner: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '4px solid #e2e8f0',
      borderTopColor: '#4338ca',
      animation: 'spin 1s linear infinite',
      marginBottom: '15px'
    },
    errorContainer: {
      padding: '20px',
      backgroundColor: '#fee2e2',
      color: '#b91c1c',
      borderRadius: '10px',
      border: '1px solid #f87171',
      marginBottom: '20px'
    },
    emptyContainer: {
      padding: '40px',
      textAlign: 'center',
      color: '#6b7280',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      border: '1px solid #e2e8f0'
    }
  };

  // CSS animation for spinner
  const spinnerStyle = document.createElement('style');
  spinnerStyle.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(spinnerStyle);

  // Create even/odd row styles with hover effects
  const getRowStyle = (index) => {
    return {
      ...styles.tableRow,
      backgroundColor: index % 2 === 0 ? '#eef2ff' : 'white',
    };
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Student CGPA Ranking</h1>

      {/* Horizontal Filter Section */}
      <form onSubmit={applyFilters} style={styles.filterSection}>
        {/* Department */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>Department</label>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">All</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Starting Year */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>Start Year</label>
          <select
            name="startingYear"
            value={filters.startingYear}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">Start</option>
            {startingYearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Ending Year */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>End Year</label>
          <select
            name="endingYear"
            value={filters.endingYear}
            onChange={handleFilterChange}
            style={styles.select}
          >
            <option value="">End</option>
            {endingYearOptions.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>Sort Order</label>
          <button
            type="button"
            onClick={toggleSortOrder}
            style={{...styles.button, ...styles.sortButton}}
          >
            {filters.sortOrder === 'DESC' ? 'High to Low' : 'Low to High'}
          </button>
        </div>

        {/* Apply Filters Button */}
        <div style={styles.filterGroup}>
          <label style={styles.label}>&nbsp;</label>
          <button
            type="submit"
            style={{...styles.button, ...styles.applyButton}}
          >
            Apply Filters
          </button>
        </div>
      </form>

      {/* Charts - Side by Side */}
      {stats.length > 0 && (
        <div style={styles.chartsContainer}>
          {/* Bar Chart */}
          <div style={styles.chartBox}>
            <h2 style={styles.chartTitle}>CGPA Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  tick={{ fill: '#4338ca', fontSize: 12 }}
                  tickLine={{ stroke: '#4338ca' }}
                  axisLine={{ stroke: '#4338ca' }}
                />
                <YAxis
                  tick={{ fill: '#4338ca' }}
                  tickLine={{ stroke: '#4338ca' }}
                  axisLine={{ stroke: '#4338ca' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#4338ca',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar
                  dataKey="students"
                  fill="#4f46e5"
                  name="Number of Students"
                  radius={[4, 4, 0, 0]}
                  barSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={styles.chartBox}>
            <h2 style={styles.chartTitle}>CGPA Distribution</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={130}
                  fill="#8884d8"
                  dataKey="students"
                  nameKey="name"
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [`${value} students`, props.payload.name]}
                  contentStyle={{
                    backgroundColor: '#f3f4f6',
                    borderColor: '#4338ca',
                    borderRadius: '4px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Student Table */}
      <h2 style={styles.chartTitle}>Student Rankings</h2>

      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          {error}
        </div>
      ) : students.length > 0 ? (
        <table style={styles.table}>
          <thead style={styles.tableHead}>
            <tr>
              <th style={styles.tableHeadCell}>Rank</th>
              <th style={styles.tableHeadCell}>Roll Number</th>
              <th style={styles.tableHeadCell}>Name</th>
              <th style={styles.tableHeadCell}>CGPA</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.rno} style={getRowStyle(index)}>
                <td style={styles.tableCell}>{index + 1}</td>
                <td style={styles.tableCell}>{student.rno}</td>
                <td style={styles.tableCell}>{student.name}</td>
                <td style={styles.tableCellCGPA}>
                  {parseFloat(student.cgpa).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.emptyContainer}>
          Apply filters to view the student rankings
        </div>
      )}
    </div>
  );
};

export default CGPARankingPage;