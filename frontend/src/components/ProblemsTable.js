import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  padding: 20px;
  color: #e4e4e4;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: rgba(30, 30, 30, 0.9);
  border-radius: 8px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
  color: #888;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #404040;
`;

const ProblemsTable = () => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Status</Th>
            <Th>Title</Th>
            <Th>Difficulty</Th>
            <Th>Category</Th>
            <Th>Last Solved</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>✅</Td>
            <Td>Two Sum</Td>
            <Td style={{ color: '#00B8A3' }}>Easy</Td>
            <Td>Array</Td>
            <Td>2024-03-10</Td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ProblemsTable; 