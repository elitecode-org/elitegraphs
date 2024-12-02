import { Link, useLocation } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react";

const Navigation = () => {
  const location = useLocation();

  const NavLink = ({ to, icon }) => (
    <Link
      to={to}
      className={`w-10 h-10 flex items-center justify-center mb-4 rounded-xl transition-all duration-200
        relative group overflow-hidden
        ${
          location.pathname === to
            ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white"
            : "text-gray-500 hover:text-white"
        }`}
    >
      {/* Hover effect background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      />

      {/* Active indicator */}
      {location.pathname === to && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 
          bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full
          shadow-[0_0_8px_rgba(59,130,246,0.5)]"
        />
      )}

      {/* Icon */}
      <div className="relative z-10">{icon}</div>
    </Link>
  );

  return (
    <div
      className="fixed left-0 top-0 bottom-0 w-16 bg-gray-900 backdrop-blur-xl 
      flex flex-col items-center pt-8 z-50 border-r border-gray-800/50"
    >
      <div className="flex-1 flex flex-col items-center">
        <NavLink
          to="/"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          }
        />
        <NavLink
          to="/graph"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          }
        />
        <NavLink
          to="/problems"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]"
            >
              <path d="M3 6h18M3 12h18M3 18h18" />
            </svg>
          }
        />
      </div>

      <div className="mb-8">
        <SignOutButton>
          <button
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all 
            duration-200 text-gray-500 hover:text-white relative group overflow-hidden"
          >
            <div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
              opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10 drop-shadow-[0_0_3px_rgba(59,130,246,0.3)]"
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
