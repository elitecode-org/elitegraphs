import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';

const NavContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 60px;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  z-index: 100;
`;

const NavItem = styled(Link)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  border-radius: 8px;
  color: ${props => props.active ? '#fff' : '#666'};
  background-color: ${props => props.active ? '#333' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

const Navigation = () => {
  const location = useLocation();

  return (
    <NavContainer>
      <NavItem to="/" active={location.pathname === '/' ? 1 : 0}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16 L12 8 M8 12 L16 12"/>
        </svg>
      </NavItem>
      <NavItem to="/problems" active={location.pathname === '/problems' ? 1 : 0}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M3 12h18M3 18h18"/>
        </svg>
      </NavItem>
    </NavContainer>
  );
};

export default Navigation; 