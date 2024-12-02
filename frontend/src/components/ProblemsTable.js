import React from 'react';
import styled from 'styled-components';

const TableContainer = styled.div`
  padding: 20px;
  background-color: #1a1a1a;
  border-radius: 8px;
  margin: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #333;
  color: #888;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #333;
`;

const ProblemsTable = () => {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Difficulty</Th>
            <Th>Category</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <Td>Coming soon...</Td>
            <Td></Td>
            <Td></Td>
            <Td></Td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
};

export default ProblemsTable; 