import React from "react";
import Navigation from "./Navigation";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      <main className="pl-16 pt-8">{children}</main>
    </div>
  );
};

export default Layout;
