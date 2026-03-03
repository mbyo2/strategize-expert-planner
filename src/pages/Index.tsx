import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';
import LoadingScreen from '@/components/ui/loading-screen';

const Index = () => {
  const { isAuthenticated, isLoading } = useSimpleAuth();
  
  if (isLoading) {
    return <LoadingScreen message="Initializing..." />;
  }
  
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
      <Features />
    </main>
  );
};

export default Index;
