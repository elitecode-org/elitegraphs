import React, { useState, useRef, useEffect } from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

function FilterButton({ filters, setFilters }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const difficulties = ["Easy", "Medium", "Hard"];
  const categories = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Binary Search",
    "Tree",
    "Matrix",
    "Binary Tree",
    "Two Pointers",
  ];
  const confidenceLevels = [
    { label: "High (4-5★)", value: [4, 5] },
    { label: "Medium (2-3★)", value: [2, 3] },
    { label: "Low (0-1★)", value: [0, 1] },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 mr-1 px-3 bg-blue-500/20 py-2 text-gray-400 hover:text-white 
          transition-colors rounded-lg hover:bg-blue-500/30"
      >
        <FunnelIcon className="h-5 w-5" />
        <span>Filter</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-72 origin-top-right rounded-lg
              bg-gray-900/80 backdrop-blur-xl shadow-lg ring-1 ring-black ring-opacity-5
              divide-y divide-gray-800/50 z-50 border border-gray-800/50"
          >
            {/* Difficulty Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Difficulty
              </h3>
              <div className="space-y-2">
                {difficulties.map((difficulty) => (
                  <label
                    key={difficulty}
                    className="flex items-center gap-2 group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.difficulty.includes(difficulty)}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          difficulty: prev.difficulty.includes(difficulty)
                            ? prev.difficulty.filter((d) => d !== difficulty)
                            : [...prev.difficulty, difficulty],
                        }));
                      }}
                      className="rounded border-gray-700 text-blue-500 focus:ring-blue-500
                        bg-gray-800/50"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {difficulty}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Completion Status */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Completion
              </h3>
              <select
                value={filters.completion}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    completion: e.target.value,
                  }))
                }
                className="w-full bg-gray-800/50 text-gray-300 rounded-md p-2 border border-gray-700
                  focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="incomplete">Not Completed</option>
              </select>
            </div>

            {/* Categories Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Categories
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                {categories.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          categories: prev.categories.includes(category)
                            ? prev.categories.filter((c) => c !== category)
                            : [...prev.categories, category],
                        }));
                      }}
                      className="rounded border-gray-700 text-blue-500 focus:ring-blue-500
                        bg-gray-800/50"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Confidence Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Confidence
              </h3>
              <div className="space-y-2">
                {confidenceLevels.map((level) => (
                  <label
                    key={level.label}
                    className="flex items-center gap-2 group"
                  >
                    <input
                      type="checkbox"
                      checked={filters.confidence.some((c) =>
                        level.value.includes(c)
                      )}
                      onChange={() => {
                        setFilters((prev) => ({
                          ...prev,
                          confidence: prev.confidence.some((c) =>
                            level.value.includes(c)
                          )
                            ? prev.confidence.filter(
                                (c) => !level.value.includes(c)
                              )
                            : [...prev.confidence, ...level.value],
                        }));
                      }}
                      className="rounded border-gray-700 text-blue-500 focus:ring-blue-500
                        bg-gray-800/50"
                    />
                    <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                      {level.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterButton;
