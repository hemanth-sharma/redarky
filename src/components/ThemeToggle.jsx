import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme-context';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 text-[#434655] hover:text-[#131b2e] hover:bg-slate-50 transition rounded-lg"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-4.5 w-4.5" />
      ) : (
        <Sun className="h-4.5 w-4.5" />
      )}
    </Button>
  );
}