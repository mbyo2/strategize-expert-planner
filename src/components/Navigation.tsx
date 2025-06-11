
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { navItems, NavItem } from '@/lib/nav-items';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Navigation = () => {
  const location = useLocation();
  const { hasRole } = useSimpleAuth();

  // Filter navigation items based on user roles
  const filteredNavItems = navItems.filter((item: NavItem) => {
    // If no role is required, show the item
    if (!item.requiredRole) {
      return true;
    }
    // If a role is required, check if user has that role
    return hasRole(item.requiredRole);
  });

  return (
    <nav className="flex flex-col space-y-1">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.url;
        
        return (
          <Button
            key={item.url}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'justify-start gap-2',
              isActive && 'bg-secondary'
            )}
            asChild
          >
            <Link to={item.url}>
              <Icon className="h-4 w-4" />
              {item.title}
              {item.requiredRole && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {item.requiredRole}+
                </span>
              )}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
};

export default Navigation;
