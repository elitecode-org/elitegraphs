import React, { useState } from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { categoryColors } from '../constants/leetcodeCategories';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #1a1a1a;
  color: #fff;
`;

const Th = styled.th`
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #333;
  color: #888;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Td = styled.td`
  padding: 12px 16px;
  border-bottom: 1px solid #2a2a2a;
`;

const TitleLink = styled.a`
  color: #fff;
  text-decoration: none;
  &:hover {
    color: #4f9fff;
  }
`;

const ExternalLink = styled.a`
  color: #888;
  &:hover {
    color: #fff;
  }
`;

const CategoryTag = styled.span`
  display: inline-block;
  padding: 2px 8px;
  margin-right: 4px;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => props.color}33;
  color: ${props => props.color};
`;

const CategoryTooltip = styled.div`
  position: absolute;
  background: #2a2a2a;
  padding: 8px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: ${props => props.show ? 'block' : 'none'};
`;

const ConfidenceIndicator = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
  font-size: 0.8rem;
  background: ${props => {
    switch (props.level) {
      case 'hard': return '#ff375f22';
      case 'normal': return '#ffc01e22';
      case 'easy': return '#00b8a322';
      default: return '#88888822';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case 'hard': return '#ff375f';
      case 'normal': return '#ffc01e';
      case 'easy': return '#00b8a3';
      default: return '#888';
    }
  }};
`;

const ProblemsTable = ({ problems }) => {
  const [tooltipData, setTooltipData] = useState({ show: false, categories: [], x: 0, y: 0 });

  const handleCategoryHover = (e, categories) => {
    setTooltipData({
      show: true,
      categories,
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleCategoryLeave = () => {
    setTooltipData({ ...tooltipData, show: false });
  };

  const getLeetCodeUrl = (title) => {
    return `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, '-')}/`;
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <Th>Title</Th>
            <Th>Difficulty</Th>
            <Th>Last Completed</Th>
            <Th>Confidence</Th>
            <Th>Categories</Th>
            <Th></Th>
          </tr>
        </thead>
        <tbody>
          {problems?.length ? (
            problems.map((problem) => (
              <tr key={problem.id}>
                <Td>
                  <TitleLink href={getLeetCodeUrl(problem.title)} target="_blank">
                    {problem.title}
                  </TitleLink>
                </Td>
                <Td>
                  <span style={{ 
                    color: problem.difficulty === 'Hard' ? '#ff375f' : 
                           problem.difficulty === 'Medium' ? '#ffc01e' : 
                           '#00b8a3' 
                  }}>
                    {problem.difficulty}
                  </span>
                </Td>
                <Td>{format(new Date(problem.lastCompleted), 'MMM d, yyyy')}</Td>
                <Td>
                  <ConfidenceIndicator level={problem.confidence}>
                    {problem.confidence}
                  </ConfidenceIndicator>
                </Td>
                <Td>
                  <div 
                    onMouseEnter={(e) => handleCategoryHover(e, problem.categories)}
                    onMouseLeave={handleCategoryLeave}
                  >
                    {problem.categories.slice(0, 3).map((category, index) => (
                      <CategoryTag 
                        key={index}
                        color={categoryColors[category] || '#888'}
                      >
                        {category}
                      </CategoryTag>
                    ))}
                    {problem.categories.length > 3 && (
                      <CategoryTag color="#888">+{problem.categories.length - 3}</CategoryTag>
                    )}
                  </div>
                </Td>
                <Td>
                  <ExternalLink 
                    href={getLeetCodeUrl(problem.title)} 
                    target="_blank"
                    title="Open in LeetCode"
                  >
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </ExternalLink>
                </Td>
              </tr>
            ))
          ) : (
            <tr>
              <Td colSpan="6" style={{ textAlign: 'center' }}>No problems to display</Td>
            </tr>
          )}
        </tbody>
      </Table>
      <CategoryTooltip 
        show={tooltipData.show}
        style={{ 
          top: tooltipData.y + 10,
          left: tooltipData.x + 10
        }}
      >
        {tooltipData.categories.map((category, index) => (
          <CategoryTag 
            key={index}
            color={categoryColors[category] || '#888'}
          >
            {category}
          </CategoryTag>
        ))}
      </CategoryTooltip>
    </>
  );
};

ProblemsTable.defaultProps = {
  problems: [
    {
      id: 1,
      title: "Merge Intervals",
      difficulty: "Medium",
      lastCompleted: "2024-03-12T14:30:00Z",
      confidence: "normal",
      categories: ["Array", "Sorting", "Intervals"]
    },
    {
      id: 2,
      title: "LRU Cache",
      difficulty: "Medium",
      lastCompleted: "2024-03-11T09:15:00Z",
      confidence: "hard",
      categories: ["Hash Table", "Linked List", "Design", "Doubly-Linked List"]
    },
    {
      id: 3,
      title: "Maximum Subarray",
      difficulty: "Easy",
      lastCompleted: "2024-03-10T16:45:00Z",
      confidence: "easy",
      categories: ["Array", "Dynamic Programming", "Divide and Conquer"]
    },
    {
      id: 4,
      title: "Word Break",
      difficulty: "Medium",
      lastCompleted: "2024-03-09T11:20:00Z",
      confidence: "normal",
      categories: ["Hash Table", "String", "Dynamic Programming", "Trie", "Memoization"]
    },
    {
      id: 5,
      title: "Trapping Rain Water",
      difficulty: "Hard",
      lastCompleted: "2024-03-08T15:10:00Z",
      confidence: "hard",
      categories: ["Array", "Two Pointers", "Dynamic Programming", "Stack", "Monotonic Stack"]
    }
  ]
};

export default ProblemsTable; 