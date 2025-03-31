
import React, { useState } from 'react';
import { useTeams } from '@/hooks/useTeams';
import { Team } from '@/types/team';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Edit, Trash2 } from 'lucide-react';
import TeamDetailsDialog from './TeamDetailsDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const { deleteTeam } = useTeams();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    deleteTeam(team.id);
    setDeleteDialogOpen(false);
  };

  // Get initials for the avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>{team.name}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={() => setDetailsOpen(true)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
          <CardDescription>{team.description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="flex items-center mb-4">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {team.members.length} {team.members.length === 1 ? 'Member' : 'Members'}
            </span>
          </div>
          
          <div className="flex -space-x-2 overflow-hidden">
            {team.members.slice(0, 5).map((member) => (
              <Avatar key={member.id} className="border-2 border-background">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
            ))}
            {team.members.length > 5 && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                +{team.members.length - 5}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-6">
          <Button variant="outline" className="w-full" onClick={() => setDetailsOpen(true)}>
            Manage Team
          </Button>
        </CardFooter>
      </Card>

      <TeamDetailsDialog 
        team={team} 
        open={detailsOpen} 
        onOpenChange={setDetailsOpen}
      />
      
      <DeleteConfirmationDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onConfirm={handleDelete}
        title="Delete Team"
        description={`Are you sure you want to delete ${team.name}? This action cannot be undone.`}
      />
    </>
  );
};

export default TeamCard;
