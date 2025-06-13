
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { navItems } from '@/lib/nav-items';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import UserMenu from './UserMenu';

const Header = () => {
  const { session, hasRole } = useSimpleAuth();

  const filteredNavItems = navItems.filter(item => {
    // Show item if no role required or user has the required role
    return !item.requiresRole || hasRole(item.requiresRole);
  });

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Strategic Dashboard</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex mx-6 flex-1">
          <ul className="flex space-x-6">
            {filteredNavItems.map((item) => {
              if (item.requiresRole && !hasRole(item.requiresRole)) {
                return null;
              }
              
              const Icon = item.icon;
              return (
                <li key={item.url}>
                  <Link 
                    to={item.url}
                    className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {session.user && <UserMenu />}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.url}
                    to={item.url}
                    className="flex items-center space-x-2 text-sm font-medium"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
