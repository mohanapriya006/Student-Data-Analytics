// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import CGPARankingPage from './components/CGPARankingPage';
// import mainpage from './components/mainpage';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<CGPARankingPage />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CGPARankingPage from './components/CGPARankingPage';
import MainPage from './components/mainpage'; 
import LeetCodePage from './components/leetcode';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/cgpa-ranking" element={<CGPARankingPage />} />
        <Route path="/students" element={<LeetCodePage />} /> 
      </Routes>
    </Router>
  );
}

export default App;