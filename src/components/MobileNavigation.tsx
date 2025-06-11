
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BarChart2, Target, Users, Settings, 
  Menu, X, ChevronLeft, Download 
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { navItems, NavItem } from '@/lib/nav-items';

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useSimpleAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  
  // Filter navigation items based on user roles
  const filteredNavItems = navItems.filter((item: NavItem) => {
    // If no role is required, show the item
    if (!item.requiredRole) {
      return true;
    }
    // If a role is required, check if user has that role
    return hasRole(item.requiredRole);
  });
  
  // Check if current path matches nav item path
  const isActive = (path: string) => location.pathname === path;
  
  // Navigate and close menu
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  // Handle offline status changes
  React.useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('You are back online');
    };
    
    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline. Some features may be limited.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Back button for deeper navigation
  const showBackButton = location.pathname !== '/';
  
  return (
    <>
      {/* Fixed bottom navigation bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t z-40 py-2 px-4">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="flex-1"
            >
              <Home className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Button>
          )}
          
          {/* Show first 3 filtered items for quick access */}
          {filteredNavItems.slice(1, 4).map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.url}
                variant="ghost"
                size="icon"
                onClick={() => handleNavigation(item.url)}
                className={cn(
                  "flex-1",
                  isActive(item.url) && "text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="sr-only">{item.title}</span>
              </Button>
            );
          })}
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-1">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="pt-10">
              <SheetHeader className="pb-4 border-b">
                <SheetTitle>Menu</SheetTitle>
                {isOffline && (
                  <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 self-start">
                    Offline Mode
                  </Badge>
                )}
              </SheetHeader>
              <div className="py-4 space-y-1">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.url}
                      variant={isActive(item.url) ? "default" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => handleNavigation(item.url)}
                    >
                      <span className="mr-3">
                        <Icon className="h-5 w-5" />
                      </span>
                      {item.title}
                      {item.requiredRole && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          {item.requiredRole}+
                        </span>
                      )}
                    </Button>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => {
                      if (isOffline) {
                        toast.error('This feature is not available offline');
                        return;
                      }
                      toast.success('Content synced for offline use');
                    }}
                  >
                    <Download className="mr-3 h-5 w-5" />
                    Sync for offline
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {/* Spacer to prevent content being hidden behind the fixed navigation */}
      <div className="lg:hidden h-16 w-full" />
    </>
  );
};

export default MobileNavigation;
