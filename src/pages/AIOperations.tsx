
import React from 'react';
import PageLayout from '@/components/PageLayout';
import AIOperationsCenter from '@/components/palantir/AIOperationsCenter';

const AIOperationsPage = () => {
  return (
    <PageLayout 
      title="AI Operations" 
      subtitle="Comprehensive AI/ML model management, deployment, and monitoring platform"
    >
      <AIOperationsCenter />
    </PageLayout>
  );
};

export default AIOperationsPage;
