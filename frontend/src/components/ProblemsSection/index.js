import React from 'react';
import styled from 'styled-components';
import SuggestedProblems from './SuggestedProblems';
import ProblemsTable from '../ProblemsTable';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 24px;
`;

const SectionTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
`;

// Sample data for new problems
const SAMPLE_NEW_PROBLEMS = [
  {
    id: 4,
    title: "Maximum Running Time of N Computers",
    difficulty: "Hard",
    lastCompleted: null, // New problem, never completed
    confidence: null,
    categories: ["Array", "Binary Search", "Greedy", "Sorting"],
    reason: "New problem that matches your skill level in Binary Search and Greedy algorithms",
    suggestedBecause: {
      type: "new_problem",
      matchingStrengths: ["Binary Search", "Greedy"],
      addedDate: "2024-03-15"
    }
  },
  {
    id: 5,
    title: "Find the K-Sum of an Array",
    difficulty: "Medium",
    lastCompleted: null,
    confidence: null,
    categories: ["Array", "Dynamic Programming", "Heap"],
    reason: "New problem combining Dynamic Programming with Heap operations, areas you excel in",
    suggestedBecause: {
      type: "new_problem",
      matchingStrengths: ["Dynamic Programming"],
      addedDate: "2024-03-14"
    }
  },
  {
    id: 6,
    title: "Count Subarrays With Fixed Bounds",
    difficulty: "Medium",
    lastCompleted: null,
    confidence: null,
    categories: ["Array", "Queue", "Sliding Window", "Monotonic Queue"],
    reason: "New problem that builds on your recent practice with Sliding Window techniques",
    suggestedBecause: {
      type: "new_problem",
      matchingStrengths: ["Sliding Window"],
      addedDate: "2024-03-13"
    }
  }
];

// Sample data for review suggestions
const SAMPLE_REVIEW_PROBLEMS = [
  {
    id: 1,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    lastCompleted: "2024-02-15T10:30:00Z",
    confidence: "normal",
    categories: ["Array", "Hash Table", "Union Find"],
    reason: "You've been doing well with Hash Table problems, but this one combines it with Union Find which you haven't practiced recently",
    suggestedBecause: {
      type: "category_gap",
      category: "Union Find",
      daysSinceLastPractice: 30
    }
  },
  {
    id: 2,
    title: "Course Schedule II",
    difficulty: "Medium",
    lastCompleted: "2024-01-20T15:45:00Z",
    confidence: "hard",
    categories: ["Depth-First Search", "Breadth-First Search", "Graph", "Topological Sort"],
    reason: "Graph algorithms appear in your weak areas. This problem will help strengthen your graph traversal skills",
    suggestedBecause: {
      type: "weak_area",
      category: "Graph",
      successRate: "65%"
    }
  },
  {
    id: 3,
    title: "Sliding Window Maximum",
    difficulty: "Hard",
    lastCompleted: "2024-03-01T09:15:00Z",
    confidence: "normal",
    categories: ["Array", "Queue", "Sliding Window", "Heap", "Monotonic Queue"],
    reason: "Similar to problems you've mastered, but introduces Monotonic Queue concept for optimization",
    suggestedBecause: {
      type: "skill_progression",
      fromCategory: "Sliding Window",
      toCategory: "Monotonic Queue",
      relatedMasteredProblem: "Longest Substring Without Repeating Characters"
    }
  }
];

const ProblemsSection = ({ problems }) => {
  return (
    <Container>
      <div>
        <SectionTitle>New Problems</SectionTitle>
        <SuggestedProblems problems={SAMPLE_NEW_PROBLEMS} />
      </div>
      <div>
        <SectionTitle>Suggested Review</SectionTitle>
        <SuggestedProblems problems={SAMPLE_REVIEW_PROBLEMS} />
      </div>
      <div>
        <SectionTitle>All Problems</SectionTitle>
        <ProblemsTable problems={problems} />
      </div>
    </Container>
  );
};

export default ProblemsSection; 