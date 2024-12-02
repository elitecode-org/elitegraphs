import React from "react";

function ViewToggle({ viewMode, setViewMode }) {
  const buttonClasses = `
    px-4 py-2 rounded-md text-sm font-medium transition-colors
    focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900
  `;

  const activeButtonClasses = `
    bg-purple-500/20 text-purple-400
    hover:bg-purple-500/30
  `;

  const inactiveButtonClasses = `
    bg-gray-800 text-gray-400
    hover:bg-gray-700 hover:text-gray-300
  `;

  return (
    <div className="flex gap-2 p-1 bg-gray-900/50 rounded-lg backdrop-blur-sm">
      <button
        onClick={() => setViewMode("table")}
        className={`${buttonClasses} ${
          viewMode === "table" ? activeButtonClasses : inactiveButtonClasses
        }`}
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
          </svg>
          Table View
        </span>
      </button>
      <button
        onClick={() => setViewMode("cards")}
        className={`${buttonClasses} ${
          viewMode === "cards" ? activeButtonClasses : inactiveButtonClasses
        }`}
      >
        <span className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
          Card View
        </span>
      </button>
    </div>
  );
}

export default ViewToggle;
