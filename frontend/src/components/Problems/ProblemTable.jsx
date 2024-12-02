import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { getDifficultyColor, getLeetCodeUrl } from "./utils";
import CategoryTags from "./CategoryTags";
import ExternalLink from "./ExternalLink";

function ProblemTable({ problems }) {
  const headerClasses = `px-6 py-4 text-left text-lg font-medium border-b border-gray-800/30
    text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500`;

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-gray-900/50 backdrop-blur-sm">
      <table className="w-full border-collapse">
        <thead className="bg-gray-900/30">
          <tr>
            {["Title", "Difficulty", "Last Completed", "Categories", ""].map(
              (header) => (
                <th key={header} className={headerClasses}>
                  {header}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/30">
          {problems?.map((problem) => (
            <TableRow key={problem.id} problem={problem} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({ problem }) {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group hover:bg-gray-900/30 transition-colors"
    >
      <td className="px-6 py-4">
        <a
          href={getLeetCodeUrl(problem.questionTitle)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-purple-400 transition-colors"
        >
          {problem.questionTitle || "Untitled Problem"}
        </a>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2 py-1 rounded-md text-md ${getDifficultyColor(
            problem.difficulty
          )}`}
        >
          {problem.difficulty || "Unknown"}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-400">
        {problem.completedAt
          ? format(new Date(problem.completedAt), "MMM d, yyyy")
          : "Not completed"}
      </td>
      <td className="px-6 py-4">
        <CategoryTags categories={problem.tags || []} />
      </td>
      <td className="px-6 py-4">
        <ExternalLink url={getLeetCodeUrl(problem.questionTitle)} />
      </td>
    </motion.tr>
  );
}

export default ProblemTable;
