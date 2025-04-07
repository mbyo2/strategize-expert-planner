
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { withAuth } from '@/hooks/useAuth';
import TeamList from '@/components/TeamManagement/TeamList';
import TeamCollaboration from '@/components/TeamManagement/TeamCollaboration';
import { TeamsProvider } from '@/hooks/useTeams';

const Teams = () => {
  return (
    <PageLayout title="Team Management">
      <TeamsProvider>
        <div className="container mx-auto py-6 space-y-8">
          <TeamList />
          <TeamCollaboration />
        </div>
      </TeamsProvider>
    </PageLayout>
  );
};

// Only admins and managers can access team management
export default withAuth(['admin', 'manager'])(Teams);
