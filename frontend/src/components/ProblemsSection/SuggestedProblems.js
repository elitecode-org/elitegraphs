import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { categoryColors } from '../../constants/leetcodeCategories';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 16px;
`;

const ProblemCard = styled.div`
  background: #1f1f1f;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #333;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #444;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const Title = styled.a`
  color: #fff;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  margin-bottom: 12px;
  display: block;

  &:hover {
    color: #4f9fff;
  }
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const Difficulty = styled.span`
  color: ${props => 
    props.level === 'Hard' ? '#ff375f' : 
    props.level === 'Medium' ? '#ffc01e' : 
    '#00b8a3'};
  font-size: 0.9rem;
`;

const LastSolved = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
`;

const CategoryTag = styled.span`
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  background: ${props => props.color}22;
  color: ${props => props.color};
`;

const Reason = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin: 12px 0 0 0;
  padding-top: 12px;
  border-top: 1px solid #333;
  line-height: 1.4;
`;

const SuggestedProblems = ({ problems }) => {
  const getLeetCodeUrl = (title) => {
    return `https://leetcode.com/problems/${title.toLowerCase().replace(/\s+/g, '-')}/`;
  };

  return (
    <Container>
      {problems.map(problem => (
        <ProblemCard key={problem.id}>
          <Title href={getLeetCodeUrl(problem.title)} target="_blank">
            {problem.title}
          </Title>
          <InfoRow>
            <Difficulty level={problem.difficulty}>
              {problem.difficulty}
            </Difficulty>
            <span style={{ color: '#444' }}>•</span>
            <LastSolved>
              Last solved {format(new Date(problem.lastCompleted), 'MMM d, yyyy')}
            </LastSolved>
          </InfoRow>
          <Categories>
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
          </Categories>
          <Reason>
            {problem.reason}
          </Reason>
        </ProblemCard>
      ))}
    </Container>
  );
};

export default SuggestedProblems; 