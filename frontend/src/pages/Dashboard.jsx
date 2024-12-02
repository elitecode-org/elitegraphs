import { useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "../context/userContext";

function StatsCard({ title, value, total }) {
  return (
    <motion.div
      className="p-6 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3
        className="text-xl font-semibold mb-2 text-transparent bg-clip-text 
        bg-gradient-to-r from-pink-500 to-purple-500"
      >
        {title}
      </h3>
      <p className="text-gray-300">{total ? `${value} / ${total}` : value}</p>
    </motion.div>
  );
}

function RecentProblemCard({ problem }) {
  return (
    <motion.div
      className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 backdrop-blur-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-medium text-white">
        {problem.questionTitle}
      </h3>
      <div className="flex justify-between items-center mt-2">
        <span
          className={`text-sm ${
            problem.status === "accepted" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {problem.status === "accepted" ? "Solved" : "Attempted"}
        </span>
        <span className="text-sm text-gray-400">{problem.difficultyLevel}</span>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const {
    stats,
    problems,
    isLoading,
    error,
    dashboardKey,
    lastUpdated,
    validateAndSetDashboardKey,
    logout,
    getTotalCompletionRate,
  } = useUser();

  const [inputKey, setInputKey] = useState("");

  const handleSubmitKey = async (e) => {
    e.preventDefault();
    await validateAndSetDashboardKey(inputKey);
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 pl-16 p-8 flex items-center justify-center">
        <div className="text-white">Loading your LeetCode journey...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pr-16 pl-32 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1
            className="text-3xl font-bold text-transparent bg-clip-text 
            bg-gradient-to-r from-blue-500 to-purple-500
            drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]"
          >
            Your LeetCode Journey
          </h1>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 
              text-gray-200 hover:bg-gray-800/50 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard
            title="Easy Problems"
            value={stats?.easy?.solved || 0}
            total={stats?.easy?.total || 0}
          />
          <StatsCard
            title="Medium Problems"
            value={stats?.medium?.solved || 0}
            total={stats?.medium?.total || 0}
          />
          <StatsCard
            title="Hard Problems"
            value={stats?.hard?.solved || 0}
            total={stats?.hard?.total || 0}
          />
          <StatsCard
            title="Total Completion"
            value={`${getTotalCompletionRate().toFixed(1)}%`}
          />
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Recent Problems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {problems.slice(0, 6).map((problem) => (
              <RecentProblemCard key={problem.problemId} problem={problem} />
            ))}
          </div>
        </div>

        <div className="text-gray-400 text-sm">
          Last updated: {new Date(lastUpdated || "").toLocaleString()}
        </div>
      </div>
    </div>
  );
}
