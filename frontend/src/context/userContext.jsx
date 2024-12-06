import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import createUserService from "../services/userService";
import leetcodeTags from "../leetcode_tags.json";
import { useAuth } from "@clerk/clerk-react";

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
  problemTags: {},
};

export function UserProvider({ children }) {
  const [state, setState] = useState(initialState);
  const { getToken, isSignedIn } = useAuth();

  const userService = useMemo(
    () => createUserService({ getToken, isSignedIn }),
    [getToken, isSignedIn]
  );

  const fetchUserData = async () => {
    if (!isSignedIn) {
      setState(initialState);
      return;
    }

    try {
      const userData = await userService.getUser();

      // Calculate stats from user problems
      const stats = {
        totalSolved: 0,
        totalAttempted: 0,
        easy: { solved: 0, attempted: 0, total: 0 },
        medium: { solved: 0, attempted: 0, total: 0 },
        hard: { solved: 0, attempted: 0, total: 0 },
        username: userData.username,
      };

      // Calculate problem tags
      const problemTags = {};

      userData.problems.forEach((problem) => {
        const difficulty = problem.difficultyLevel.toLowerCase();

        // Update difficulty stats
        stats[difficulty].attempted++;
        if (problem.isSolved) {
          stats[difficulty].solved++;
          stats.totalSolved++;
        }

        // Update total attempted
        if (problem.status !== "not attempted") {
          stats.totalAttempted++;
        }

        // Update problem tags (assuming tags are available in leetcodeTags)
        const problemTag = leetcodeTags[problem.questionNumber];
        if (problemTag) {
          problemTags[problemTag] = (problemTags[problemTag] || 0) + 1;
        }
      });

      setState({
        problems: mergeProblemTags(userData.problems),
        stats,
        problemTags,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isSignedIn]);

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

  const value = {
    problems: state.problems,
    stats: state.stats,
    problemTags: state.problemTags,
    isLoading: state.isLoading,
    refetchUserData: fetchUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useAppUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
