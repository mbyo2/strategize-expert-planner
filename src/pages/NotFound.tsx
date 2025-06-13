
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, ArrowLeft, Search, HelpCircle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="text-9xl font-bold text-gray-300 dark:text-gray-700">404</div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-gray-100">
            Page Not Found
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              What can you do?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Link to="/">
                <Button className="w-full flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
            </div>
            
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">
                Looking for something specific?
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link to="/goals" className="text-primary hover:underline">Goals</Link>
                <Link to="/planning" className="text-primary hover:underline">Planning</Link>
                <Link to="/teams" className="text-primary hover:underline">Teams</Link>
                <Link to="/analytics" className="text-primary hover:underline">Analytics</Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please{' '}
            <Link to="/settings" className="text-primary hover:underline">
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
