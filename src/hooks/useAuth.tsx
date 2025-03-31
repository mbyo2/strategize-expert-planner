
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define user roles
export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;
}

// Profile update interface
export interface ProfileUpdate {
  name?: string;
  email?: string;
  avatar?: string;
  jobTitle?: string;
  department?: string;
  company?: string;
  bio?: string;
}

// Auth context interface
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  updateProfile: (profileData: ProfileUpdate) => void;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@intantiko.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  },
  {
    id: '2',
    name: 'Manager User',
    email: 'manager@intantiko.com',
    role: 'manager',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=manager',
  },
  {
    id: '3',
    name: 'Analyst User',
    email: 'analyst@intantiko.com',
    role: 'analyst',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=analyst',
  },
  {
    id: '4',
    name: 'Viewer User',
    email: 'viewer@intantiko.com',
    role: 'viewer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=viewer',
  },
];

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role hierarchy (higher index = more permissions)
const roleHierarchy: UserRole[] = ['viewer', 'analyst', 'manager', 'admin'];

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = mockUsers.find(u => u.email === email);
        
        // Simple mock authentication (in real app, verify password hash)
        if (foundUser && password.length >= 8) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          setIsLoading(false);
          resolve();
        } else {
          setIsLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = mockUsers.find(u => u.email === email);
        
        if (existingUser) {
          setIsLoading(false);
          reject(new Error('Email already in use'));
        } else {
          // Create new user with viewer role by default
          const newUser: User = {
            id: `user-${Date.now()}`,
            name,
            email,
            role: 'viewer',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          };
          
          setUser(newUser);
          localStorage.setItem('user', JSON.stringify(newUser));
          setIsLoading(false);
          resolve();
        }
      }, 1000); // Simulate network delay
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  // Update user profile
  const updateProfile = (profileData: ProfileUpdate) => {
    if (!user) return;
    
    // Update user object with new profile data
    const updatedUser = { ...user, ...profileData };
    
    // Update state and localStorage
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Check if user has required role permissions
  const hasPermission = (requiredRoles: UserRole[]): boolean => {
    if (!user) return false;
    
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    
    // Check if user's role has sufficient permissions
    return requiredRoles.some(role => {
      const requiredRoleIndex = roleHierarchy.indexOf(role);
      return userRoleIndex >= requiredRoleIndex;
    });
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    hasPermission,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role-based protection HOC
export const withAuth = (requiredRoles: UserRole[] = []) => <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, hasPermission } = useAuth();
    
    if (!isAuthenticated) {
      // Redirect to login or show unauthorized UI
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h1 className="text-2xl font-semibold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground mb-6">Please log in to access this page.</p>
          <a href="/login" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Go to Login
          </a>
        </div>
      );
    }
    
    if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
      // Show unauthorized UI
      return (
        <div className="flex flex-col items-center justify-center h-screen p-4">
          <h1 className="text-2xl font-semibold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have the required permissions to access this page.
          </p>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
  
  return WithAuth;
};

export default useAuth;
