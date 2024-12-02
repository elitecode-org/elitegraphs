import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { getDifficultyColor, getLeetCodeUrl } from "./utils";
import CategoryTags from "./CategoryTags";

function ProblemCards({ problems }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {problems.map((problem) => (
        <motion.div
          key={problem.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 p-6 rounded-lg border border-gray-800/50 
            transition-all duration-300 hover:-translate-y-1 hover:shadow-lg 
            hover:shadow-purple-500/10 hover:border-purple-500/50"
        >
          <a
            href={getLeetCodeUrl(problem.questionTitle)}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xl font-semibold mb-4 
              text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 
              hover:text-purple-400 transition-colors"
          >
            {problem.questionTitle}
          </a>

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-md font-medium ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {problem.difficulty}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-400">
              {problem.lastCompleted
                ? `Last solved ${format(
                    new Date(problem.lastCompleted),
                    "MMM d, yyyy"
                  )}`
                : "Not solved yet"}
            </span>
          </div>

          <CategoryTags categories={problem.tags || []} />
        </motion.div>
      ))}
    </div>
  );
}

export default ProblemCards;
