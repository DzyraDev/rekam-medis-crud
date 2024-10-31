import React from "react";
import Navbar from "../components/ui/Navbar";
import Sidebar from "../components/ui/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <div className="flex pt-16">
        {" "}
        {/* pt-16 untuk kompensasi fixed navbar */}
        {/* Sidebar */}
        <div className="flex-shrink-0">
          <Sidebar />
        </div>
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <main className="bg-white rounded-2xl shadow-sm min-h-[calc(100vh-7rem)]">
              <div className="p-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
