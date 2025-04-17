
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ error, errorInfo });
    
    // Log error to your preferred monitoring service
    console.error('Uncaught error:', error, errorInfo);
    
    // You could send to a monitoring service here
    // reportErrorToService(error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
          <div className="w-full max-w-md space-y-6 text-center">
            <Shield className="h-16 w-16 text-primary mx-auto" />
            
            <h1 className="text-3xl font-bold">Something went wrong</h1>
            
            <div className="p-4 bg-muted/40 border rounded-md text-left overflow-auto max-h-60">
              <p className="text-destructive font-mono text-sm mb-2">{this.state.error?.toString()}</p>
              
              {this.state.errorInfo && (
                <details className="mt-2">
                  <summary className="text-sm cursor-pointer">Stack trace</summary>
                  <pre className="text-xs mt-2 p-2 bg-muted overflow-auto">
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
            
            <p className="text-muted-foreground">
              We apologize for the inconvenience. You can try refreshing the page or go back to the home page.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={this.handleReload} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Go to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
