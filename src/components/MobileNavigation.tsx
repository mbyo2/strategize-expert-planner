
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BarChart2, Target, Users, Settings, 
  Menu, X, ChevronLeft, Download 
} from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const MobileNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isOffline, setIsOffline] = React.useState(!navigator.onLine);
  
  // Navigation items with role permissions
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, path: '/', roles: [] },
    { name: 'Analytics', icon: <BarChart2 className="h-5 w-5" />, path: '/analytics', roles: [] },
    { name: 'Goals', icon: <Target className="h-5 w-5" />, path: '/goals', roles: [] },
    { name: 'Teams', icon: <Users className="h-5 w-5" />, path: '/teams', roles: ['manager', 'admin'] },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/settings', roles: [] },
  ];

  // Filter items based on permissions
  const filteredNavItems = navItems.filter(item => 
    item.roles.length === 0 || hasPermission(item.roles)
  );
  
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
          
          {filteredNavItems.slice(1, 4).map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="icon"
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "flex-1",
                isActive(item.path) && "text-primary"
              )}
            >
              {item.icon}
              <span className="sr-only">{item.name}</span>
            </Button>
          ))}
          
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
                {filteredNavItems.map((item) => (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    className="w-full justify-start mb-1"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Button>
                ))}
                
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
