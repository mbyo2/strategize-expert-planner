
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Sun, Moon, HomeIcon, LineChart, Target, LayoutDashboard, Briefcase, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useAuth, UserRole } from '@/hooks/useAuth';

const Header: React.FC = () => {
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

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight banking-gradient bg-clip-text text-transparent">
            Intantiko
          </span>
        </div>
        
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-2">
            {filteredNavItems.map((item) => (
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
        )}
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
