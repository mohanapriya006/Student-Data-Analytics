import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CGPARankingPage from './components/CGPARankingPage';
import MainPage from './components/mainpage'; 
import LeetCodePage from './components/leetcode';
import OverallRankingPage from './components/OverallRanking';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cgpa-ranking" element={<CGPARankingPage />} />
        <Route path="/students-lc" element={<LeetCodePage />} /> 
        <Route path="/overall-ranking" element={<OverallRankingPage />} />

      </Routes>
    </Router>
  );
}

export default App;
