import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Sparkles } from 'lucide-react';
import { navItems } from '@/lib/nav-items';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import UserMenu from './UserMenu';
import { cn } from '@/lib/utils';

const Header = () => {
  const { session, hasRole } = useSimpleAuth();
  const location = useLocation();

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!item.requiredRole) return true;
    return hasRole(item.requiredRole);
  });

  const isActive = (url: string) => location.pathname === url;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mr-8 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow duration-300">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Strategic
            </span>
            <span className="text-xs text-muted-foreground font-medium -mt-0.5">
              Dashboard
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1">
          <ul className="flex items-center gap-1">
            {filteredNavItems.slice(0, 6).map((item) => {
              const Icon = item.icon;
              const active = isActive(item.url);
              return (
                <li key={item.url}>
                  <Link 
                    to={item.url}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                      active 
                        ? "text-primary bg-primary/10" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className={cn(
                      "h-4 w-4 transition-colors",
                      active && "text-primary"
                    )} />
                    <span>{item.title}</span>
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-3 ml-auto">
          {session.user && <UserMenu />}
          
          {/* Mobile Navigation Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden hover:bg-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 pt-12">
              <nav className="flex flex-col gap-1">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.url);
                  return (
                    <Link 
                      key={item.url}
                      to={item.url}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                        active 
                          ? "text-primary bg-primary/10" 
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5",
                        active && "text-primary"
                      )} />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
