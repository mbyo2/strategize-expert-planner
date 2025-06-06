
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isAuthenticated } = useSimpleAuth();
  
  if (isAuthenticated) {
    return <Dashboard />;
  }
  
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
    </main>
  );
};

export default Index;
