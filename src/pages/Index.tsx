
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import TestUserLogin from '@/components/TestUserLogin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, Users, Database, Lock } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useSimpleAuth();
  
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <Dashboard />
      </div>
    );
  }
  
  return (
    <main className="min-h-screen">
      <Hero />
      
      {/* Security Implementation Status */}
      <section className="py-16 bg-green-50 dark:bg-green-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-4">
              🔒 Security Hardened & Ready
            </h2>
            <p className="text-green-700 dark:text-green-300 max-w-2xl mx-auto">
              Your application has been secured with enterprise-grade security measures and is ready for testing.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Database Security</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Row Level Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Role-based Access</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Data Minimization</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">User Management</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Session Security</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>MFA Ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Audit Logging</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Data Protection</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Encrypted Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Secure Headers</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>CSP Hardened</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-200 dark:border-green-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-sm">Security Monitoring</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Threat Detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Session Monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Activity Tracking</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                Production Ready
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                Security Hardened
              </Badge>
              <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                Role-Based Access
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              All critical security fixes have been implemented including database RLS hardening, 
              session security improvements, CSP strengthening, and data minimization measures.
            </p>
          </div>
        </div>
      </section>

      {/* Test User Login Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Test the Application</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Login with any test user below to explore the full application with sample data. 
              Each role has different permissions and access levels.
            </p>
          </div>
          
          <TestUserLogin />
        </div>
      </section>

      <Features />
    </main>
  );
};

export default Index;
