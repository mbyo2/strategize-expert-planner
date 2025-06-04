import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Target, 
  Calendar, 
  BarChart3, 
  Users, 
  Settings,
  Building2,
  TestTube
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  requiredRole?: string;
}

const Navigation = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/',
      icon: Home,
    },
    {
      title: 'Strategic Goals',
      href: '/goals',
      icon: Target,
    },
    {
      title: 'Planning',
      href: '/planning',
      icon: Calendar,
    },
    {
      title: 'Industry Analysis',
      href: '/industry',
      icon: Building2,
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      requiredRole: 'analyst'
    },
    {
      title: 'Teams',
      href: '/teams',
      icon: Users,
      requiredRole: 'manager'
    },
    {
      title: 'Test Setup',
      href: '/test-setup',
      icon: TestTube,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        
        return (
          <Button
            key={item.href}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'justify-start gap-2',
              isActive && 'bg-secondary'
            )}
            asChild
          >
            <Link to={item.href}>
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
