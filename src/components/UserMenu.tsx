
import React from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Shield, User, Settings, LogOut, UserCog } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthCompat';

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/login">
          <Button variant="outline" size="sm">
            Log in
          </Button>
        </Link>
        <Link to="/signup">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    );
  }

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Role badge color
  const getRoleBadgeColor = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400';
      case 'analyst':
        return 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400';
      case 'viewer':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-400';
    }
  };

  // Generate a default avatar URL based on email
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={user.name || user.email} />
            <AvatarFallback>{getInitials(user.name || user.email)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor()}`}>
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User'}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          {user.role === 'admin' && (
            <DropdownMenuItem>
              <UserCog className="mr-2 h-4 w-4" />
              <Link to="/admin">Admin Dashboard</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
