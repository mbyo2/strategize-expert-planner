
import React from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
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
