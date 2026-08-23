import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const titles = {
  '/dashboard': 'Dashboard',
  '/queue': 'Action Queue',
  '/product-profile': 'Product Profile',
  '/scraper-activity': 'Scraper Activity',
  '/integrations': 'Integrations',
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="h-screen w-screen flex overflow-hidden antialiased">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-full border-r border-border bg-card z-50">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm animate-fade-in-fast"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[240px] h-full bg-card border-r border-border flex flex-col animate-slide-in-from-left duration-200">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          title={titles[location.pathname] || 'Redarky'}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="w-full p-6 lg:p-8 max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
