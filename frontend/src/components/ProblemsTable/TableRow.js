import React from 'react';
import { format } from 'date-fns';
import { Td, TitleLink, ConfidenceIndicator, CategoryTag, ExternalLink } from './styles';
import { categoryColors } from '../../constants/leetcodeCategories';
import { useCategoryTooltip } from './hooks';

const TableRow = ({ problem }) => {
  const { tooltipProps, handleCategoryHover, handleCategoryLeave } = useCategoryTooltip();

  const getLeetCodeUrl = (title) => {
    return `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, '-')}/`;
  };

  return (
    <tr>
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
          {/* SVG icon */}
        </ExternalLink>
      </Td>
    </tr>
  );
};

export default TableRow; 