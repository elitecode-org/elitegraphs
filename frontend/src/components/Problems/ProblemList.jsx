import React, { useState } from "react";
import ProblemTable from "./ProblemTable";
import ProblemCards from "./ProblemCards";
import ViewToggle from "./ViewToggle";
import { useUser } from "../../context/userContext";

function ProblemList() {
  const [viewMode, setViewMode] = useState("table");
  const { problems, isLoading } = useUser();

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
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          Problems
        </h2>
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      </div>

      {viewMode === "table" ? (
        <ProblemTable problems={problems} />
      ) : (
        <ProblemCards problems={problems} />
      )}
    </div>
  );
}

export default ProblemList;
