
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6">
            Strategic Intelligence Platform
          </h1>
          <p className="text-xl text-slate-200 max-w-3xl mx-auto mb-8">
            Transform your business strategy with real-time insights, collaborative planning, and data-driven decision making.
          </p>
          <div className="flex justify-center gap-4">
            {!isAuthenticated ? (
              <>
                <Button asChild size="lg" variant="default" className="bg-white text-slate-900 hover:bg-slate-100">
                  <Link to="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                  <Link to="/login">Sign In</Link>
                </Button>
              </>
            ) : (
              <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100">
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
    </div>
  );
};

export default Hero;
