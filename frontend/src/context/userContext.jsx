import React, { createContext, useContext, useState, useEffect } from "react";
import createUserService from "../services/userService";
import leetcodeTags from "../leetcode_tags.json";

const UserContext = createContext(undefined);

const initialState = {
  problems: [],
  stats: {
    totalSolved: 0,
    totalAttempted: 0,
    easy: {
      solved: 0,
      attempted: 0,
      total: 0,
    },
    medium: {
      solved: 0,
      attempted: 0,
      total: 0,
    },
    hard: {
      solved: 0,
      attempted: 0,
      total: 0,
    },
  },
  isLoading: true,
  error: null,
  dashboardKey: localStorage.getItem("dashboardKey"),
  lastUpdated: null,
  problemTags: {},
};

export function UserProvider({ children }) {
  const [state, setState] = useState(initialState);

  const userService = createUserService({
    getToken: async () => state.dashboardKey,
    isSignedIn: !!state.dashboardKey,
  });

  useEffect(() => {
    if (state.dashboardKey) {
      loadProblems();
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.dashboardKey]);

  const mergeProblemTags = (problems) => {
    const mergedProblems = problems.map((problem) => {
      const tagEntry = Object.entries(leetcodeTags).find(
        ([_, data]) => data.name === problem.problemId
      );

      const tagData = tagEntry ? tagEntry[1] : null;

      return {
        ...problem,
        tags: tagData?.tags || [],
        difficulty: tagData?.difficulty || problem.difficultyLevel,
      };
    });

    return mergedProblems;
  };

  const calculateStats = (problems) => {
    const stats = {
      totalSolved: 0,
      totalAttempted: 0,
      easy: {
        solved: 0,
        attempted: 0,
        total: 0,
      },
      medium: {
        solved: 0,
        attempted: 0,
        total: 0,
      },
      hard: {
        solved: 0,
        attempted: 0,
        total: 0,
      },
    };

    problems.forEach((problem) => {
      const difficulty = problem.difficultyLevel.toLowerCase();

      // Increment total for each difficulty
      stats[difficulty].total++;

      if (problem.status === "accepted") {
        stats[difficulty].solved++;
        stats.totalSolved++;
      } else if (problem.status === "attempted") {
        stats[difficulty].attempted++;
        stats.totalAttempted++;
      }
    });

    return stats;
  };

  const loadProblems = async () => {
    if (!state.dashboardKey) return;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const data = await userService.getScrapedProblems(state.dashboardKey);
      const problemsWithTags = mergeProblemTags(data.problems);
      // Calculate stats from the merged problems
      const stats = calculateStats(problemsWithTags);

      setState((prev) => ({
        ...prev,
        problems: problemsWithTags,
        stats,
        lastUpdated: data.lastUpdated,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      }));

      if (error instanceof Error && error.message.includes("Unauthorized")) {
        logout();
      }
    }
  };

  const validateAndSetDashboardKey = async (key) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      localStorage.setItem("dashboardKey", key);
      setState((prev) => ({ ...prev, dashboardKey: key }));
      return true;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      }));
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("dashboardKey");
    setState({
      ...initialState,
      dashboardKey: null,
      isLoading: false,
    });
  };

  const getProblemById = (problemId) => {
    return state.problems.find((p) => p.problemId === problemId) || null;
  };

  const getProblemsByDifficulty = (difficulty) => {
    return state.problems.filter((p) => p.difficultyLevel === difficulty);
  };

  const getSolvedProblems = () => {
    return state.problems.filter((p) => p.status === "accepted");
  };

  const getAttemptedProblems = () => {
    return state.problems.filter((p) => p.status === "attempted");
  };

  const getProblemsByTag = (tag) => {
    return state.problems.filter((p) => p.tags?.includes(tag));
  };

  const getAllTags = () => {
    const tagSet = new Set();
    state.problems.forEach((problem) => {
      problem.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet);
  };

  const getCompletionRate = (difficulty) => {
    const stats = state.stats[difficulty.toLowerCase()];
    return stats.total > 0 ? (stats.solved / stats.total) * 100 : 0;
  };

  const getTotalCompletionRate = () => {
    const total =
      state.stats.easy.total +
      state.stats.medium.total +
      state.stats.hard.total;
    return total > 0 ? (state.stats.totalSolved / total) * 100 : 0;
  };

  const value = {
    ...state,
    validateAndSetDashboardKey,
    logout,
    refreshProblems: loadProblems,
    getProblemById,
    getProblemsByDifficulty,
    getSolvedProblems,
    getAttemptedProblems,
    getProblemsByTag,
    getAllTags,
    getCompletionRate,
    getTotalCompletionRate,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
