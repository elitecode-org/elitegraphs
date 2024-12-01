import React from "react";
import LeetCodeGraph from "./components/LeetCodeGraph";

const App = () => {
  return (
    <div className="min-h-screen bg-[#1e1e1e] text-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <LeetCodeGraph />
      </div>
    </div>
  );
};

export default App;