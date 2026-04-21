import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 pt-24 lg:pt-16 lg:ml-24 p-6 md:p-10 md:pt-28 lg:p-16 flex justify-center">
        <div className="w-full max-w-[900px]">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
