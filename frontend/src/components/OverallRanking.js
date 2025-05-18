import React, { useState, useEffect, useRef } from "react";
import "./OverallRanking.css";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const departments = [
  "All", "CSBS", "CSE", "AIML", "AIDS", "ECE", "EEE", "IT", "Cyber", "Civil", "Mech", "BME"
];

export default function OverallRanking() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedBatch, setSelectedBatch] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [batches, setBatches] = useState(["All"]);
  const graphRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    const url =
      selectedDept === "All"
        ? "http://localhost:5000/students"
        : `http://localhost:5000/students?department=${selectedDept}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const studentsWithBatch = data.map((student) => {
          const batch =
            student.starting_year && student.ending_year
              ? `${student.starting_year} - ${student.ending_year}`
              : "Unknown";
          return { ...student, batch };
        });

        setStudents(studentsWithBatch);

        const batchList = Array.from(
          new Set(studentsWithBatch.map((student) => student.batch))
        );
        setBatches(["All", ...batchList]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, [selectedDept]);

  const merged = students.map((student) => {
    const overall = ((student.cgpa || 0) * 10 * 0.6 + (student.lc || 0) * 0.4).toFixed(2);
    return { ...student, overall: parseFloat(overall) };
  });

  const filtered = merged.filter(
    (student) =>
      (selectedDept === "All" || student.department === selectedDept) &&
      (selectedBatch === "All" || student.batch === selectedBatch)
  );

  const ranked = [...filtered].sort((a, b) => b.overall - a.overall);

  const searched = ranked.filter((student, index) => {
    const query = searchQuery.toLowerCase();
    const rank = (index + 1).toString();
    return (
      rank.includes(query) ||
      student.rno?.toString().toLowerCase().includes(query) ||
      student.name?.toLowerCase().includes(query) ||
      student.department?.toLowerCase().includes(query) ||
      student.cgpa?.toString().includes(query) ||
      student.lc?.toString().includes(query) ||
      student.overall?.toString().includes(query) ||
      student.batch?.toLowerCase().includes(query)
    );
  });

  const scoreRanges = {
    "90-100": 0,
    "80-89": 0,
    "70-79": 0,
    "60-69": 0,
    "<60": 0,
  };

  ranked.forEach((student) => {
    const score = student.overall;
    if (score >= 90) scoreRanges["90-100"]++;
    else if (score >= 80) scoreRanges["80-89"]++;
    else if (score >= 70) scoreRanges["70-79"]++;
    else if (score >= 60) scoreRanges["60-69"]++;
    else scoreRanges["<60"]++;
  });

  const mostCommonRange = Object.entries(scoreRanges).reduce(
    (a, b) => (a[1] > b[1] ? a : b),
    ["", 0]
  )[0];

  const scrollToGraph = () => {
    if (graphRef.current) {
      graphRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const maxOverall = ranked.length ? Math.max(...ranked.map((s) => s.overall)) : 0;
  const minOverall = ranked.length ? Math.min(...ranked.map((s) => s.overall)) : 0;
  const avgOverall = ranked.length
    ? (ranked.reduce((sum, s) => sum + s.overall, 0) / ranked.length).toFixed(2)
    : 0;
  const topScorer = ranked.length
    ? ranked.reduce((top, curr) => (curr.overall > top.overall ? curr : top)).name
    : "N/A";

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2 className="heading">🏆 Overall Student Ranking</h2>

      <div className="mb-4">
        <label className="label">Select Department</label>
        <select className="select" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label">Select Batch</label>
        <select className="select" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)}>
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label">Search Students</label>
        <input
          type="text"
          className="select"
          placeholder="Search by name, roll no, rank, etc."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <button onClick={scrollToGraph} className="scroll-btn">
        📊 Scroll to Performance Graph
      </button>

      <table className="table">
        <thead className="table-head">
          <tr>
            <th>Rank</th>
            <th>Roll No</th>
            <th>Name</th>
            <th>Department</th>
            <th>CGPA</th>
            <th>LC Score</th>
            <th>Overall</th>
            <th>Batch</th>
          </tr>
        </thead>
        <tbody>
          {searched.map((student, index) => (
            <tr key={student.rno || index} className="table-row">
              <td className="rank">#{index + 1}</td>
              <td>{student.rno}</td>
              <td>{student.name}</td>
              <td>{student.department}</td>
              <td>{student.cgpa}</td>
              <td>{student.lc}</td>
              <td><strong>{student.overall}</strong></td>
              <td>{student.batch}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="graph-section" ref={graphRef}>
        <h3 className="graph-heading">📈 Performance Trend (Overall Score)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ranked} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="rno" />
            <YAxis domain={[0, 100]} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="overall" stroke="#6366f1" fillOpacity={1} fill="url(#colorOverall)" />
          </AreaChart>
        </ResponsiveContainer>
        <p className="graph-note">
          The above graph shows the variation in overall performance among students in{" "}
          {selectedDept === "All" ? "all departments" : selectedDept}.
        </p>
      </div>

      {ranked.length > 0 && (
        <>
          <p className="summary">
            In the {selectedDept === "All" ? "overall dataset" : `${selectedDept} department`}, the highest overall score is <strong>{maxOverall}</strong> by <strong>{topScorer}</strong>. The average overall score is <strong>{avgOverall}</strong> and the lowest is <strong>{minOverall}</strong>.
          </p>
          <p className="summary">
            Most students fall within the <span className="common-range">{mostCommonRange}</span> overall score range.
          </p>
        </>
      )}
    </div>
  );
}
