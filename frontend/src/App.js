import React, { useState } from "react";
import LeetCodeGraph from "./components/LeetCodeGraph";
import ProblemsTable from "./components/ProblemsTable";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #1e1e1e;
  color: #e4e4e4;
`;

const NavBar = styled.nav`
  width: 64px;
  background: #2d2d2d;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
`;

const NavButton = styled.button`
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? '#404040' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#888'};
  cursor: pointer;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 20px;

  &:hover {
    background: ${props => props.active ? '#404040' : '#363636'};
    color: #fff;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  position: relative;
  height: 100vh;
  overflow: hidden;
`;

const TableIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 3h18v18H3V3zm16 2H5v4h14V5zM5 11v4h4v-4H5zm6 0v4h8v-4h-8zm-6 6v4h4v-4H5zm6 0v4h8v-4h-8z"/>
  </svg>
);

const GraphIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
    <path d="M16.5 12c0 2.5-2 4.5-4.5 4.5S7.5 14.5 7.5 12 9.5 7.5 12 7.5s4.5 2 4.5 4.5z"/>
  </svg>
);

const App = () => {
  const [activeView, setActiveView] = useState('problems');

  return (
    <AppContainer>
      <NavBar>
        <NavButton
          active={activeView === 'problems'}
          onClick={() => setActiveView('problems')}
          title="Problems"
        >
          <TableIcon />
        </NavButton>
        <NavButton
          active={activeView === 'graph'}
          onClick={() => setActiveView('graph')}
          title="Graph View"
        >
          <GraphIcon />
        </NavButton>
      </NavBar>
      <MainContent>
        {activeView === 'problems' ? (
          <ProblemsTable />
        ) : (
          <div className="w-full max-w-6xl">
            <LeetCodeGraph />
          </div>
        )}
      </MainContent>
    </AppContainer>
  );
};

export default App;