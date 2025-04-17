
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { withAuth } from '@/hooks/useAuth';
import TeamList from '@/components/TeamManagement/TeamList';
import TeamCollaboration from '@/components/TeamManagement/TeamCollaboration';
import { TeamsProvider } from '@/hooks/useTeams';
import { OrganizationsProvider } from '@/hooks/useOrganizations';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Teams = () => {
  return (
    <PageLayout title="Team Management">
      <OrganizationsProvider>
        <TeamsProvider>
          <div className="container mx-auto py-6 space-y-8">
            <div className="flex justify-end">
              <Button variant="outline" asChild>
                <Link to="/organization-management" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Organization Settings
                </Link>
              </Button>
            </div>
            <TeamList />
            <TeamCollaboration />
          </div>
        </TeamsProvider>
      </OrganizationsProvider>
    </PageLayout>
  );
};

// Only admins and managers can access team management
export default withAuth(['admin', 'manager'])(Teams);
