
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { navItems } from '@/lib/nav-items';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

const Navigation = () => {
  const location = useLocation();
  const { hasRole } = useSimpleAuth();

  const filteredNavItems = navItems.filter(item => {
    // Show item if no role required or user has the required role
    return !item.requiresRole || hasRole(item.requiresRole);
  });

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {filteredNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.url;
        
        return (
          <Link
            key={item.url}
            to={item.url}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              isActive && "bg-muted text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
