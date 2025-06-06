
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import Dashboard from '@/components/Dashboard';
import Header from '@/components/Header';

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
      <Features />
    </main>
  );
};

export default Index;
