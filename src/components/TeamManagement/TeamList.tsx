
import React, { useState } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent,
} from '@/components/ui/card';
import TeamCard from './TeamCard';
import CreateTeamDialog from './CreateTeamDialog';

const TeamList = () => {
  const { teams, isLoading } = useTeams();
  const [searchQuery, setSearchQuery] = useState('');
  const [createTeamOpen, setCreateTeamOpen] = useState(false);

  const filteredTeams = teams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-bold">Teams</h2>
        <Button onClick={() => setCreateTeamOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create Team
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {filteredTeams.length === 0 ? (
        <div className="text-center p-8 border rounded-md">
          <h3 className="font-medium text-lg">No teams found</h3>
          <p className="text-muted-foreground">Create a new team to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}

      <CreateTeamDialog open={createTeamOpen} onOpenChange={setCreateTeamOpen} />
    </div>
  );
};

export default TeamList;
