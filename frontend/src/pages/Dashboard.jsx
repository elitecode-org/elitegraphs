import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth, useUser } from "@clerk/clerk-react";
import createUserService from "../services/userService";
import { useAppUser } from "../context/userContext";
import { getDifficultyColor } from "../components/Problems/utils";
import CodeReviewModal from "../components/Problems/CodeReviewModal";
import { useNavigate } from "react-router-dom";
import DashboardKeyModal from "../components/Dashboard/DashboardKeyModal";
import { EyeIcon } from "@heroicons/react/24/outline";

function calculateReviewScore(problem) {
  const daysSinceAttempt = Math.floor(
    (new Date() - new Date(problem.lastAttempted)) / (1000 * 60 * 60 * 24)
  );
  const confidenceScore = problem.confidence || 0;

  // Higher score means more urgent to review
  // Exponentially increase weight for older problems
  const timeScore =
    daysSinceAttempt <= 7 ? daysSinceAttempt : Math.pow(daysSinceAttempt, 1.2);

  // Confidence has less impact than time
  const confidenceWeight = (5 - confidenceScore) * 2;

  return timeScore + confidenceWeight;
}

function isProblemMastered(problem) {
  const fiveStarSubmissions = problem.submissions?.filter(
    (submission) => submission.confidence === 5
  );
  return problem.confidence === 5 && fiveStarSubmissions?.length >= 2;
}

function getProblemId(problem) {
  return problem.questionTitle.replace(/\s+/g, "-").toLowerCase();
}

function StatsCard({ title, value, total }) {
  return (
    <motion.div
      className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-lg"
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h3
        className="text-xl font-semibold mb-2 text-transparent bg-clip-text 
        bg-gradient-to-r from-blue-500 to-pink-500"
      >
        {title}
      </h3>
      <p className="text-gray-300 font-bold">
        {total ? `${value} / ${total}` : value}
      </p>
    </motion.div>
  );
}

function RecentProblemCard({ problem }) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Don't navigate if clicking the "View Code" button
    if (e.target.tagName === "BUTTON") {
      return;
    }
    window.open(
      `https://leetcode.com/problems/${getProblemId(problem)}`,
      "_blank"
    );
  };

  return (
    <>
      <motion.div
        className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-lg
          h-[120px] flex flex-col justify-between cursor-pointer hover:bg-gray-800/50 
          transition-colors group relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={handleCardClick}
      >
        <div>
          <h3 className="text-lg font-medium text-white line-clamp-1">
            {problem.questionTitle}
          </h3>
          <div className="flex justify-between items-center mt-2">
            <span
              className={`text-sm ${
                problem.status === "accepted"
                  ? "text-green-400"
                  : "text-yellow-400"
              }`}
            >
              {problem.status === "accepted" ? "Solved" : "Attempted"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">
                {problem.confidence === -1 ? (
                  <span className="text-gray-500 text-sm italic">
                    Not rated
                  </span>
                ) : (
                  <>
                    {"★".repeat(problem.confidence || 0)}
                    <span className="text-gray-600">
                      {"★".repeat(5 - (problem.confidence || 0))}
                    </span>
                  </>
                )}
              </span>
              <span
                className={`text-sm text-gray-400 ${getDifficultyColor(
                  problem.difficultyLevel
                )}`}
              >
                {problem.difficultyLevel}
              </span>
            </div>
          </div>
        </div>

        {problem.submissions?.length > 0 && (
          <div className="absolute -bottom-2 -right-2 w-5 h-5">
            <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-3 h-3 text-blue-400"
                fill="currentColor"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            </div>
          </div>
        )}

        {problem.submissions?.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsReviewOpen(true);
            }}
            className="absolute inset-x-0 bottom-0 px-4 py-2 bg-blue-500/20 text-blue-400 
              hover:bg-blue-500/30 hover:text-blue-300 transition-all text-sm
              opacity-0 group-hover:opacity-100 rounded-b-lg"
          >
            View Code
          </button>
        )}
      </motion.div>

      <CodeReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        code={
          problem.submissions?.[problem.submissions.length - 1]?.code ||
          "No code available"
        }
        title={`${
          problem.status === "accepted" ? "Accepted" : "Attempted"
        } Code: ${problem.questionTitle}`}
        problemTitle={problem.questionTitle}
      />
    </>
  );
}

function getScoreStyle(score, problem) {
  // Check if problem has 5-star confidence and recent attempt
  const daysSinceAttempt = Math.floor(
    (new Date() - new Date(problem.lastAttempted)) / (1000 * 60 * 60 * 24)
  );
  const isRecentFiveStar = problem.confidence === 5 && daysSinceAttempt < 30;

  if (isRecentFiveStar) {
    return {
      text: "✓",
      classes: "bg-green-500/20 text-green-400 border-green-500/30",
    };
  } else if (score > 1000) {
    return {
      text: "!!!",
      classes: "bg-red-500/20 text-red-400 border-red-500/30",
    };
  } else if (score > 500) {
    return {
      text: "!!",
      classes: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
  } else {
    return {
      text: "!",
      classes: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
  }
}

export default function Dashboard() {
  const { problems, stats, isLoading, refetchUserData } = useAppUser();
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const userService = createUserService({ getToken, isSignedIn });
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(null);
  const [dashboardKey, setDashboardKey] = useState(
    localStorage.getItem("dashboardKey") || ""
  );
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  const handleSubmitKey = async (e) => {
    e.preventDefault();
    try {
      setError(null);

      // Sync the scraped problems first
      await userService.syncScrapedProblems(
        inputKey,
        user.id,
        user.primaryEmailAddress?.emailAddress,
        user.fullName,
        user.username
      );

      // Refetch user data to update the dashboard
      await refetchUserData();

      // If sync successful, save the key
      localStorage.setItem("dashboardKey", inputKey);
      setDashboardKey(inputKey);
    } catch (err) {
      setError("Failed to validate dashboard key");
      setInputKey("");
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await userService.syncScrapedProblems(dashboardKey);
      await refetchUserData();
    } catch (err) {
      console.error("Failed to refresh data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const problemsToReview = problems
    .filter((problem) => {
      // Skip problems that haven't been rated
      if (problem.confidence === -1) return false;

      // Skip mastered problems
      if (isProblemMastered(problem)) return false;

      // Filter by difficulty
      if (
        filterDifficulty !== "all" &&
        problem.difficultyLevel.toLowerCase() !== filterDifficulty
      ) {
        return false;
      }

      // Filter by category/tag
      if (filterCategory !== "all" && !problem.tags?.includes(filterCategory)) {
        return false;
      }

      // Filter by status
      if (filterStatus !== "all" && problem.status !== filterStatus) {
        return false;
      }

      return true;
    })
    .map((problem) => ({
      ...problem,
      reviewScore: calculateReviewScore(problem),
    }))
    .sort((a, b) => b.reviewScore - a.reviewScore)
    .slice(0, 6); // Get top 6 problems that need review

  // Get unique categories from problems
  const categories = ["all", ...new Set(problems.flatMap((p) => p.tags || []))];

  const handleGenerateNewKey = async (newKey) => {
    setDashboardKey(newKey);
    localStorage.setItem("dashboardKey", newKey);
    await userService.updateDashboardKey(newKey);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 pl-16 p-8 flex items-center justify-center">
        <div className="text-white">Loading your LeetCode journey...</div>
      </div>
    );
  }

  if (!dashboardKey) {
    return (
      <div className="min-h-screen bg-gray-950 pl-16 p-8">
        <motion.div
          className="max-w-md mx-auto mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-4xl font-bold mb-8 text-center
            text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500
            drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            Welcome to Your Dashboard
          </h1>

          <form onSubmit={handleSubmitKey} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="dashboardKey"
                className="block text-sm font-medium text-gray-200"
              >
                Enter Your Dashboard Key
              </label>
              <input
                id="dashboardKey"
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg"
                placeholder="Enter your key..."
              />
            </div>

            {error && (
              <motion.p
                className="text-red-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative inline-flex h-12 overflow-hidden rounded-lg p-[1px] 
                focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 
                focus:ring-offset-slate-50"
            >
              <span
                className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
                bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
              />
              <span
                className="inline-flex h-full w-full cursor-pointer items-center 
                justify-center rounded-lg bg-slate-950 px-8 py-1 text-sm font-medium 
                text-white backdrop-blur-3xl"
              >
                {isLoading ? "Validating..." : "Access Dashboard"}
              </span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pr-16 pl-32 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1
            className="text-5xl font-bold text-transparent bg-clip-text 
            bg-gradient-to-r from-purple-400 to-pink-500
            drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            {stats?.username}
          </h1>

          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                text-gray-200 hover:bg-gray-800/50 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2"
            >
              <svg
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("dashboardKey");
                setDashboardKey("");
              }}
              className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                text-gray-200 hover:bg-gray-800/50 transition-colors"
            >
              Logout
            </button>

            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                text-gray-200 hover:bg-gray-800/50 transition-colors
                flex items-center gap-2"
            >
              <EyeIcon className="w-4 h-4" />
              Key
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <StatsCard
            title="Easy"
            value={stats?.easy?.solved || 0}
            total={stats?.easy?.total || 0}
          />
          <StatsCard
            title="Medium"
            value={stats?.medium?.solved || 0}
            total={stats?.medium?.total || 0}
          />
          <StatsCard
            title="Hard"
            value={stats?.hard?.solved || 0}
            total={stats?.hard?.total || 0}
          />
          <StatsCard
            title="Completion Rate"
            value={`${((stats?.totalSolved / problems.length) * 100).toFixed(
              1
            )}%`}
          />
          <StatsCard
            title="Avg Confidence"
            value={`${(
              problems.reduce(
                (acc, p) => acc + (p.confidence === -1 ? 0 : p.confidence),
                0
              ) / problems.filter((p) => p.confidence !== -1).length
            ).toFixed(1)}★`}
          />
        </div>

        <div className="mt-12">
          <div className="flex flex-col space-y-4 mb-6">
            <h2
              className="text-2xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-blue-500 to-purple-500
              drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              Problems to Review
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                <option value="all">All Status</option>
                <option value="accepted">Solved</option>
                <option value="attempted">Attempted</option>
              </select>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setFilterDifficulty("all");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
                className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] 
                  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 
                  focus:ring-offset-slate-50"
              >
                <span
                  className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
                  bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
                />
                <span
                  className="inline-flex h-full w-full cursor-pointer items-center 
                  justify-center rounded-lg bg-slate-950 px-4 py-1 text-sm font-medium 
                  text-white backdrop-blur-3xl"
                >
                  Reset Filters
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problemsToReview.length > 0 ? (
              problemsToReview.map((problem) => (
                <motion.div
                  key={problem.problemId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <div
                    className={`absolute -top-2 -right-2 w-8 h-8 rounded-full 
                    flex items-center justify-center text-sm font-medium
                    z-10 border ${
                      getScoreStyle(Math.round(problem.reviewScore), problem)
                        .classes
                    }`}
                  >
                    {
                      getScoreStyle(Math.round(problem.reviewScore), problem)
                        .text
                    }
                  </div>
                  <RecentProblemCard problem={problem} />
                </motion.div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-gray-400">
                No problems found matching your filters
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-col space-y-4 mb-6">
            <h2
              className="text-2xl font-semibold text-transparent bg-clip-text 
              bg-gradient-to-r from-blue-500 to-purple-500
              drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
            >
              Recent Problems
            </h2>

            <div className="flex flex-wrap gap-4">
              {/* Difficulty Filter */}
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>

              {/* Category Filter */}
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="relative px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
                  text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent
                  backdrop-blur-lg hover:bg-gray-800/50 transition-all
                  appearance-none cursor-pointer pr-10
                  bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTQgNmw0IDQgNC00IiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] 
                  bg-[position:right_12px_center] bg-no-repeat"
              >
                <option value="all">All Status</option>
                <option value="accepted">Solved</option>
                <option value="attempted">Attempted</option>
              </select>

              {/* Reset Filters Button */}
              <button
                onClick={() => {
                  setFilterDifficulty("all");
                  setFilterCategory("all");
                  setFilterStatus("all");
                }}
                className="relative inline-flex h-10 overflow-hidden rounded-lg p-[1px] 
                  focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 
                  focus:ring-offset-slate-50"
              >
                <span
                  className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] 
                  bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
                />
                <span
                  className="inline-flex h-full w-full cursor-pointer items-center 
                  justify-center rounded-lg bg-slate-950 px-4 py-1 text-sm font-medium 
                  text-white backdrop-blur-3xl"
                >
                  Reset Filters
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems
              .sort(
                (a, b) => new Date(b.lastAttempted) - new Date(a.lastAttempted)
              )
              .slice(0, 6)
              .map((problem) => (
                <RecentProblemCard key={problem.problemId} problem={problem} />
              ))}
          </div>
        </div>

        <div className="mt-12">
          <h2
            className="text-2xl font-semibold text-transparent bg-clip-text 
    bg-gradient-to-r from-blue-500 to-purple-500
    drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]
    mb-4"
          >
            Mastered Problems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems
              .filter((problem) => calculateReviewScore(problem) < 1)
              .sort((a, b) => calculateReviewScore(a) - calculateReviewScore(b))
              .map((problem) => (
                <RecentProblemCard key={problem.problemId} problem={problem} />
              ))}
          </div>
        </div>

        <div className="text-gray-400 text-sm mt-8">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <DashboardKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        dashboardKey={dashboardKey}
        onGenerateNewKey={handleGenerateNewKey}
      />
    </div>
  );
}
