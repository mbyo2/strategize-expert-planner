
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Sun, Moon, HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-4 w-4 mr-2" />, path: '/' },
    { name: 'Industry Analysis', icon: <LineChart className="h-4 w-4 mr-2" />, path: '/industry' },
    { name: 'Strategic Planning', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, path: '/planning' },
    { name: 'Goals', icon: <Target className="h-4 w-4 mr-2" />, path: '/goals' },
    { name: 'Resources', icon: <Briefcase className="h-4 w-4 mr-2" />, path: '/resources' },
    { name: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, path: '/settings' },
  ];

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight banking-gradient bg-clip-text text-transparent">
            Intantiko
          </span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          {navItems.map((item) => (
            <NavLink 
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center font-medium py-2 px-3 rounded-md text-sm transition-colors",
                "hover:bg-primary/10 hover:text-primary",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              )}
            >
              <span className="flex items-center">
                {item.icon}
                {item.name}
              </span>
            </NavLink>
          ))}
        </div>
        
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
