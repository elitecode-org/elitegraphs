import React, { useEffect, useState } from "react";
import ProblemTable from "./ProblemTable";
import ProblemCards from "./ProblemCards";
import ViewToggle from "./ViewToggle";
import FilterButton from "./FilterButton";
import { useAppUser } from "../../context/userContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function ProblemList() {
  const [viewMode, setViewMode] = useState("table");
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState({
    difficulty: [],
    completion: "all", // 'all', 'completed', 'incomplete'
    categories: [],
    confidence: [], // 'high', 'medium', 'low'
  });
  const { problems, isLoading } = useAppUser();

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty.length === 0 ||
      filters.difficulty.includes(problem.difficulty);

    const completionMatch =
      filters.completion === "all" ||
      (filters.completion === "completed" && problem.isSolved) ||
      (filters.completion === "incomplete" && !problem.isSolved);

    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.some((cat) => problem.tags?.includes(cat));

    const confidenceMatch =
      filters.confidence.length === 0 ||
      filters.confidence.includes(problem.confidence);

    return (
      difficultyMatch && completionMatch && categoryMatch && confidenceMatch
    );
  });

  useEffect(() => {
    console.log(problems);
  }, [problems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 px-8 pt-8">
      <div className="flex justify-between items-center">
        <h2 className="ml-2 text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Problem History
        </h2>
        <div className="flex items-center">
          <FilterButton filters={filters} setFilters={setFilters} />
          <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        </div>
      </div>

      {viewMode === "table" ? (
        <ProblemTable problems={filteredProblems} showAll={showAll} />
      ) : (
        <ProblemCards problems={filteredProblems} showAll={showAll} />
      )}

      <div className="flex justify-center mt-8">
        <button
          onClick={() => setShowAll(!showAll)}
          className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50
            text-blue-500 hover:text-blue-400 transition-colors"
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {showAll ? "Show Less" : "Show More"}
            <ChevronDownIcon
              className={`h-5 w-5 ml-2 transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProblemList;
