
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, hasPermission } = useAuth();
  
  // Define nav items with required roles
  const navItems = [
    { name: 'Dashboard', icon: <HomeIcon className="h-4 w-4 mr-2" />, path: '/', requiredRoles: [] as UserRole[] },
    { name: 'Industry Analysis', icon: <LineChart className="h-4 w-4 mr-2" />, path: '/industry', requiredRoles: ['analyst', 'manager', 'admin'] as UserRole[] },
    { name: 'Strategic Planning', icon: <LayoutDashboard className="h-4 w-4 mr-2" />, path: '/planning', requiredRoles: ['manager', 'admin'] as UserRole[] },
    { name: 'Goals', icon: <Target className="h-4 w-4 mr-2" />, path: '/goals', requiredRoles: [] as UserRole[] },
    { name: 'Resources', icon: <Briefcase className="h-4 w-4 mr-2" />, path: '/resources', requiredRoles: ['analyst', 'manager', 'admin'] as UserRole[] },
    { name: 'Settings', icon: <Settings className="h-4 w-4 mr-2" />, path: '/settings', requiredRoles: [] as UserRole[] },
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
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-3 right-3 z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      
      {isOpen && (
        <nav className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-4">
            {filteredNavItems.map((item) => (
              <NavLink 
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => cn(
                  "flex items-center font-medium py-3 px-4 rounded-md text-sm transition-colors w-full max-w-xs",
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
        </nav>
      )}
    </>
  );
};

export default Navigation;
