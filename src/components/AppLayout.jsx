import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/queue': 'Action Queue',
  '/product-profile': 'Product Profile',
  '/integrations': 'Integrations',
  '/onboarding': 'Setup Your Product Profile',
};

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const title = pageTitles[location.pathname] || 'RedArky';

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border md:block">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-sidebar-border md:hidden">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setMobileOpen(true)}
          title={title}
        />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}