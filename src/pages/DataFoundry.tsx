
import React from 'react';
import PageLayout from '@/components/PageLayout';
import DataFoundry from '@/components/palantir/DataFoundry';

const DataFoundryPage = () => {
  return (
    <PageLayout 
      title="Data Foundry" 
      subtitle="Enterprise data platform for connecting, integrating, and analyzing data from multiple sources"
    >
      <DataFoundry />
    </PageLayout>
  );
};

export default DataFoundryPage;
