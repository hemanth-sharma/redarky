import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import SystemLogPopover from '@/components/SystemLogPopover';
import { useAuth } from '@/lib/AuthContext';

export default function TopBar({ onMenuClick, title }) {
  const { user, logout } = useAuth();

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'US'; // Default fallback initials

  return (
    <header className="sticky top-0 right-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Page Title & Navigation Info */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-1 text-[#434655]"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black text-[#131b2e] tracking-tight">
            {title}
          </h1>
          <div className="h-4 w-px bg-slate-200 mx-2 hidden sm:block" />
          <span className="text-xs font-semibold text-slate-400 hidden sm:block">
            Lead Signal Control
          </span>
        </div>
      </div>

      {/* Action Controls & User Identity */}
      <div className="flex items-center gap-3">
        <SystemLogPopover />
        <ThemeToggle />
        
        <div className="h-4 w-px bg-slate-200 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center rounded-full outline-none p-0.5 hover:ring-2 hover:ring-slate-200 transition">
              <Avatar className="h-8 w-8 border border-slate-200 shadow-sm select-none">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-extrabold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5">
            <DropdownMenuLabel className="font-normal px-2 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-[#131b2e] leading-none">
                  {user?.full_name || 'RedArky User'}
                </p>
                <p className="text-xs text-[#434655] opacity-70 leading-none">
                  {user?.email || 'user@redarky.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="text-xs font-medium text-[#434655] focus:bg-slate-50 focus:text-[#131b2e] rounded-lg py-2 cursor-pointer">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs font-medium text-[#434655] focus:bg-slate-50 focus:text-[#131b2e] rounded-lg py-2 cursor-pointer">
              Billing &amp; Payments
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem
              onClick={() => logout?.()}
              className="text-xs font-bold text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg py-2 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}