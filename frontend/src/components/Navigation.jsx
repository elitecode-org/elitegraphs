import { Link, useLocation } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 bottom-0 w-16 bg-gray-900 flex flex-col items-center pt-5 z-50 border-r border-gray-800">
      <div className="flex-1 flex flex-col items-center">
        <Link
          to="/"
          className={`w-10 h-10 flex items-center justify-center mb-2.5 rounded-lg transition-all
            ${
              location.pathname === "/"
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:bg-gray-800 hover:text-white"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            s
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16 L12 8 M8 12 L16 12" />
          </svg>
        </Link>
        <Link
          to="/problems"
          className={`w-10 h-10 flex items-center justify-center mb-2.5 rounded-lg transition-all
            ${
              location.pathname === "/problems"
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:bg-gray-800 hover:text-white"
            }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </Link>
      </div>

      <div className="mb-5">
        <SignOutButton>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg transition-all text-gray-500 hover:bg-gray-800 hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </SignOutButton>
      </div>
    </div>
  );
};

export default Navigation;
