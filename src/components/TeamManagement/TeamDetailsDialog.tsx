
import React, { useState } from 'react';
import { Team, TeamMember } from '@/types/team';
import { useTeams } from '@/hooks/useTeams';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import TeamMemberList from './TeamMemberList';
import AddMemberDialog from './AddMemberDialog';

interface TeamDetailsDialogProps {
  team: Team;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TeamDetailsDialog = ({ team, open, onOpenChange }: TeamDetailsDialogProps) => {
  const { updateTeam } = useTeams();
  const [activeTab, setActiveTab] = useState('details');
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description);
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const handleSave = () => {
    updateTeam(team.id, {
      name,
      description,
    });
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Details</DialogTitle>
            <DialogDescription>
              Manage team information and members
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="details">Team Details</TabsTrigger>
              <TabsTrigger value="members">Team Members ({team.members.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Team Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Created On</Label>
                  <div className="text-sm text-muted-foreground">{team.createdAt}</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button onClick={() => setAddMemberOpen(true)}>Add Member</Button>
              </div>
              <TeamMemberList teamId={team.id} members={team.members} />
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {activeTab === 'details' && (
              <Button onClick={handleSave}>Save Changes</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddMemberDialog 
        teamId={team.id} 
        open={addMemberOpen} 
        onOpenChange={setAddMemberOpen} 
      />
    </>
  );
};

export default TeamDetailsDialog;
