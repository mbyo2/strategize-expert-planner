
import React from 'react';
import { LineChart, Target, Users, Briefcase } from 'lucide-react';

const features = [
  {
    name: 'Real-time Analytics',
    description: 'Monitor your key metrics and industry trends in real-time.',
    icon: LineChart
  },
  {
    name: 'Strategic Planning',
    description: 'Define and track your strategic goals with precision.',
    icon: Target
  },
  {
    name: 'Team Collaboration',
    description: 'Keep your teams aligned and focused on strategic objectives.',
    icon: Users
  },
  {
    name: 'Industry Insights',
    description: 'Stay ahead with comprehensive industry analysis.',
    icon: Briefcase
  }
];

const Features = () => {
  return (
    <div className="py-24 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Everything you need to succeed
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Comprehensive tools for modern business strategy
          </p>
        </div>
        
        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="relative">
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-center text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
