
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Navigation = () => {
  const { isAuthenticated, hasPermission } = useAuth();
  const isMobile = useIsMobile();
  
  // Define nav items with required roles
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-5 w-5 mr-3" />, path: '/', requiredRoles: [] as UserRole[] },
    { name: 'Industry Analysis', icon: <LineChart className="h-5 w-5 mr-3" />, path: '/industry', requiredRoles: ['analyst', 'manager', 'admin'] as UserRole[] },
    { name: 'Strategic Planning', icon: <LayoutDashboard className="h-5 w-5 mr-3" />, path: '/planning', requiredRoles: ['manager', 'admin'] as UserRole[] },
    { name: 'Goals', icon: <Target className="h-5 w-5 mr-3" />, path: '/goals', requiredRoles: [] as UserRole[] },
    { name: 'Resources', icon: <Briefcase className="h-5 w-5 mr-3" />, path: '/resources', requiredRoles: ['analyst', 'manager', 'admin'] as UserRole[] },
    { name: 'Profile', icon: <User className="h-5 w-5 mr-3" />, path: '/profile', requiredRoles: [] as UserRole[] },
    { name: 'Settings', icon: <Settings className="h-5 w-5 mr-3" />, path: '/settings', requiredRoles: [] as UserRole[] },
  ];

  // Filter nav items based on user permissions
  const filteredNavItems = isAuthenticated 
    ? navItems.filter(item => item.requiredRoles.length === 0 || hasPermission(item.requiredRoles))
    : [];

  if (!isAuthenticated || filteredNavItems.length === 0) {
    return null;
  }

  return (
    <>
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="fixed top-3 right-16 z-50 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px]">
            <div className="flex flex-col py-6 space-y-2">
              {filteredNavItems.map((item) => (
                <NavLink 
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "flex items-center font-medium py-3 px-4 rounded-md text-sm transition-colors",
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
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Navigation;
