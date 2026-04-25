/**
 * FILE: src/components/layout/DashboardLayout.jsx
 *
 * Root shell that composes Sidebar + Topbar + main content area.
 * All dashboard pages are rendered as children inside this layout.
 *
 * USAGE (in App.jsx):
 *   <DashboardLayout>
 *     <Routes>
 *       <Route path="dashboard" element={<DashboardPage />} />
 *       ...
 *     </Routes>
 *   </DashboardLayout>
 */

import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar      from "./Sidebar";
import Topbar       from "./Topbar";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Extract the active page key from the URL path (e.g., "/seller/dashboard" -> "dashboard")
  const pathParts = location.pathname.split("/");
  const active = pathParts[pathParts.length - 1] || "dashboard";

  return (
    <div className="min-h-screen bg-surface flex font-sans">
      <Sidebar
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      {/* Content area — takes remaining width */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Topbar active={active} setOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
