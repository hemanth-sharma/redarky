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

  const noScrollbarClass = "[&-::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className="h-screen w-screen bg-[#faf8ff] text-[#131b2e] flex overflow-hidden antialiased">
      {/* Desktop Sidebar Fixed Width Block */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-full border-r border-slate-200 bg-white z-50">
        <Sidebar />
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[240px] h-full bg-white border-r border-slate-200 flex flex-col animate-in slide-in-from-left duration-200">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Content Stream Container */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          title={titles[location.pathname] || "RedArky"}
          onMenuClick={() => setMobileOpen(true)}
        />

        <main className={`flex-1 overflow-y-auto custom-scrollbar bg-[#faf8ff] ${noScrollbarClass}`}>
          <div className="w-full p-6 lg:p-8 max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}