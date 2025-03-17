
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5" />, path: '/' },
    { name: 'Industry Analysis', icon: <LineChart className="h-5 w-5" />, path: '/industry' },
    { name: 'Strategic Planning', icon: <LayoutDashboard className="h-5 w-5" />, path: '/planning' },
    { name: 'Goals', icon: <Target className="h-5 w-5" />, path: '/goals' },
    { name: 'Resources', icon: <Briefcase className="h-5 w-5" />, path: '/resources' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings' },
  ];

  return (
    <nav className="flex lg:flex-col justify-between lg:justify-start lg:h-screen py-4 px-2 lg:py-8 lg:px-4 bg-sidebar border-r border-border">
      <div className="flex lg:flex-col items-center lg:items-start space-x-8 lg:space-x-0 lg:space-y-8 w-full">
        <div className="px-2 lg:px-4">
          <div className="text-xl font-semibold tracking-tight flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary mr-2 flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">SP</span>
            </div>
            <span className="hidden lg:inline">Strategize</span>
          </div>
        </div>
        
        <div className="flex-1 lg:pt-10 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible items-center lg:items-start space-x-1 lg:space-x-0 lg:space-y-1 w-full">
          {navItems.map((item) => (
            <NavLink 
              key={item.name}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center font-medium py-3 px-3 lg:pl-4 lg:pr-8 rounded-md text-sm transition-colors",
                "hover:bg-secondary hover:text-foreground",
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="ml-3 hidden lg:block">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
