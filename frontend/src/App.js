import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import LeetCodeGraph from './components/LeetCodeGraph';
import ProblemsSection from './components/ProblemsSection';
import Navigation from './components/Navigation';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #0a0a0a;
  color: #fff;
  padding-left: 60px; // Account for navigation width
`;

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navigation />
        <Routes>
          <Route path="/" element={<LeetCodeGraph />} />
          <Route path="/problems" element={<ProblemsSection />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;