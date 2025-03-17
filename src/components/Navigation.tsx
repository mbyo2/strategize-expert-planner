
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-4 w-4 mr-2" />, path: '/' },
    { name: 'Industry Analysis', icon: <LineChart className="h-4 w-4 mr-2" />, path: '/industry' },
    { name: 'Strategic Planning', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, path: '/planning' },
    { name: 'Goals', icon: <Target className="h-4 w-4 mr-2" />, path: '/goals' },
    { name: 'Resources', icon: <Briefcase className="h-4 w-4 mr-2" />, path: '/resources' },
    { name: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, path: '/settings' },
  ];

  return (
    <nav className="hidden md:flex lg:flex-col justify-between lg:justify-start lg:h-[calc(100vh-4rem)] py-4 px-2 lg:py-8 lg:px-4 bg-sidebar border-r border-border">
      <div className="flex lg:flex-col items-center lg:items-start space-x-8 lg:space-x-0 lg:space-y-8 w-full">
        <div className="flex-1 lg:pt-6 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible items-center lg:items-start space-x-1 lg:space-x-0 lg:space-y-1 w-full">
          {navItems.map((item) => (
            <NavLink 
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center font-medium py-3 px-3 lg:pl-4 lg:pr-8 rounded-md text-sm transition-colors",
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
      </div>
    </nav>
  );
};

export default Navigation;
