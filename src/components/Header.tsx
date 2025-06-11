
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Shield, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserMenu from './UserMenu';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useIsMobile } from '@/hooks/use-mobile';
import NotificationBell from './Notifications/NotificationBell';
import { navItems, NavItem } from '@/lib/nav-items';

const Header: React.FC = () => {
  const { isAuthenticated, hasRole } = useSimpleAuth();
  const isMobile = useIsMobile();
  
  // Filter nav items based on user permissions and exclude settings
  const filteredNavItems = isAuthenticated 
    ? navItems.filter((item: NavItem) => {
        // Skip settings in header navigation
        if (item.url === '/settings') return false;
        
        // If no role is required, show the item
        if (!item.requiredRole) {
          return true;
        }
        // If a role is required, check if user has that role
        return hasRole(item.requiredRole);
      })
    : [];

  return (
    <header className="border-b border-border sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          <span className="text-lg sm:text-xl font-bold tracking-tight banking-gradient bg-clip-text text-transparent ml-2">
            Intantiko
          </span>
        </div>
        
        {isAuthenticated && !isMobile && (
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink 
                  key={item.title}
                  to={item.url}
                  className={({ isActive }) => cn(
                    "flex items-center font-medium py-2 px-2 lg:px-3 rounded-md text-sm transition-colors",
                    "hover:bg-primary/10 hover:text-primary",
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground"
                  )}
                >
                  <span className="flex items-center">
                    <Icon className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{item.title}</span>
                  </span>
                </NavLink>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {isAuthenticated && <NotificationBell />}
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
