import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

const formatDate = (dateString) => {
  if (!dateString) return "Not completed";
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (error) {
    return "Invalid date";
  }
};

function ProblemsTable({ problems }) {
  const [tooltipData, setTooltipData] = useState({
    show: false,
    categories: [],
    x: 0,
    y: 0,
  });

  const getLeetCodeUrl = (title) => {
    return `https://leetcode.com/problems/${title
      .toLowerCase()
      .replace(/\s+/g, "-")}/`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "hard":
        return "bg-red-400/20 text-red-400";
      case "medium":
        return "bg-yellow-400/20 text-yellow-400";
      case "easy":
        return "bg-green-400/20 text-green-400";
      default:
        return "bg-gray-400/20 text-gray-400";
    }
  };

  const headerClasses = `
    px-6 py-4 text-left text-lg font-medium border-b border-gray-800/30
    text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500
    drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]
    [text-shadow:_0_0_15px_rgb(147,51,234,0.5)]
  `;

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-900/30">
          <tr>
            <th className={headerClasses}>Title</th>
            <th className={headerClasses}>Difficulty</th>
            <th className={headerClasses}>Last Completed</th>
            <th className={headerClasses}>Categories</th>
            <th className={headerClasses}></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/30">
          {problems?.length ? (
            problems.map((problem) => (
              <motion.tr
                key={problem.id || problem.problemId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group hover:bg-gray-900/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <a
                    href={getLeetCodeUrl(
                      problem.title || problem.questionTitle
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-purple-400 transition-colors text-base"
                  >
                    {problem.title ||
                      problem.questionTitle ||
                      "Untitled Problem"}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-md text-xs ${getDifficultyColor(
                      problem.difficulty || problem.difficultyLevel
                    )}`}
                  >
                    {problem.difficulty || problem.difficultyLevel || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-400">
                  {formatDate(problem.lastCompleted)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {(problem.categories || problem.tags || [])
                      .slice(0, 3)
                      .map((category, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 text-xs rounded-md bg-purple-500/20 text-purple-400"
                        >
                          {category}
                        </span>
                      ))}
                    {(problem.categories || problem.tags || []).length > 3 && (
                      <span className="px-2 py-0.5 text-xs rounded-md bg-gray-800 text-gray-400">
                        +{(problem.categories || problem.tags || []).length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <a
                    href={getLeetCodeUrl(
                      problem.title || problem.questionTitle
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-purple-400 transition-colors"
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
                  </a>
                </td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="5"
                className="px-4 py-3 text-center text-gray-400 border-b border-gray-800/50"
              >
                No problems to display
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProblemsTable;
