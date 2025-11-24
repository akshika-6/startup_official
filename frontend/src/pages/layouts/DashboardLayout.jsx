import React from "react";
import Sidebar from "../../components/Sidebar";

const DashboardLayout = ({ children, role }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* ✅ FIX: Removed the wrapping <div> that was causing the gap/double-background.
          The Sidebar component is 'fixed', so it doesn't need a flex wrapper.
      */}
      <Sidebar role={role} />

      {/* ✅ FIX: Added 'md:ml-64' to push content to the right.
          This creates the space for the sidebar without using a physical div.
      */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 md:ml-64 transition-all duration-300">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;