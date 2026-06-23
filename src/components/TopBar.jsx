import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
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
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground">
          <span className="font-normal text-muted-foreground">Workspace</span>
          <span className="text-muted-foreground/40">/</span>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-1.5">
        <SystemLogPopover />

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={user?.image} alt={user?.full_name || 'User'} />
                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.full_name || 'RedArky User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'user@redarky.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing &amp; Payments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-destructive focus:text-destructive"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}