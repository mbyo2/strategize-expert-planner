
import React from 'react';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BarChart3, LineChart, Target, Briefcase, Settings, Users } from 'lucide-react';

const Navigation = () => {
  const { isMobile } = useMobile();
  const location = useLocation();
  const { user, hasPermission } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
      icon: <LineChart className="h-4 w-4 mr-2" />,
      roles: [] // Available to all authenticated users
    },
    {
      title: 'Industry Analysis',
      path: '/industry',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      roles: ['analyst', 'manager', 'admin']
    },
    {
      title: 'Strategic Planning',
      path: '/planning',
      icon: <Briefcase className="h-4 w-4 mr-2" />,
      roles: ['manager', 'admin']
    },
    {
      title: 'Goals',
      path: '/goals',
      icon: <Target className="h-4 w-4 mr-2" />,
      roles: [] // Available to all authenticated users
    },
    {
      title: 'Teams',
      path: '/teams',
      icon: <Users className="h-4 w-4 mr-2" />,
      roles: ['manager', 'admin']
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <Settings className="h-4 w-4 mr-2" />,
      roles: [] // Available to all authenticated users
    }
  ];

  // Filter items based on user roles
  const filteredMenuItems = menuItems.filter(item => {
    return item.roles.length === 0 || hasPermission(item.roles);
  });

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="block lg:hidden">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="flex flex-col gap-4 mt-6">
            {filteredMenuItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2 rounded-md text-sm",
                  isActive(item.path) 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {filteredMenuItems.map((item) => (
          <NavigationMenuItem key={item.path}>
            <Link to={item.path} legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive(item.path) && "bg-accent text-accent-foreground",
                  "flex items-center"
                )}
              >
                {item.icon}
                {item.title}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
