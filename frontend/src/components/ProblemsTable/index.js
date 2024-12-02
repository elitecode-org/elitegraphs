import React, { useState, useMemo } from 'react';
import { Table, Th, Td } from './styles';
import { SortIcon } from './SortIcon';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

const ProblemsTable = ({ problems: initialProblems }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'lastCompleted',
    direction: 'desc'
  });

  // Memoized sorted problems
  const problems = useMemo(() => {
    if (!initialProblems) return [];
    
    const sortedProblems = [...initialProblems];
    
    sortedProblems.sort((a, b) => {
      switch (sortConfig.key) {
        case 'title':
          return sortConfig.direction === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        
        case 'difficulty': {
          const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
          return sortConfig.direction === 'asc'
            ? difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
            : difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        }
        
        case 'lastCompleted':
          return sortConfig.direction === 'asc'
            ? new Date(a.lastCompleted) - new Date(b.lastCompleted)
            : new Date(b.lastCompleted) - new Date(a.lastCompleted);
        
        case 'confidence': {
          const confidenceOrder = { easy: 1, normal: 2, hard: 3 };
          return sortConfig.direction === 'asc'
            ? confidenceOrder[a.confidence] - confidenceOrder[b.confidence]
            : confidenceOrder[b.confidence] - confidenceOrder[a.confidence];
        }
        
        default:
          return 0;
      }
    });

    return sortedProblems;
  }, [initialProblems, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: 
        prevConfig.key === key && prevConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc'
    }));
  };

  const columns = [
    { key: 'title', label: 'Title', sortable: true },
    { key: 'difficulty', label: 'Difficulty', sortable: true },
    { key: 'lastCompleted', label: 'Last Completed', sortable: true },
    { key: 'confidence', label: 'Confidence', sortable: true },
    { key: 'categories', label: 'Categories', sortable: false },
    { key: 'actions', label: '', sortable: false }
  ];

  return (
    <Table>
      <TableHeader 
        columns={columns}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
      <tbody>
        {problems?.length ? (
          problems.map(problem => (
            <TableRow 
              key={problem.id} 
              problem={problem}
            />
          ))
        ) : (
          <tr>
            <Td colSpan={columns.length} style={{ textAlign: 'center' }}>
              No problems to display
            </Td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default ProblemsTable; 