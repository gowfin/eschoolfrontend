
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Quiz from './quiz';
import LandingPage from './LandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz/:type" element={<Quiz />} />
      </Routes>
    </Router>
  );
};

export default App;
