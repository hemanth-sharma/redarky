import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

const titles = {
  "/dashboard": "Overview",
  "/queue": "Action Queue",
  "/product-profile": "Product Profile",
  "/integrations": "Integrations",
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      <aside className="hidden lg:block w-72 shrink-0">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar
          title={titles[location.pathname] || "RedArky"}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}