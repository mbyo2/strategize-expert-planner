
import React, { useState } from 'react';
import { TeamMember } from '@/types/team';
import { useTeams } from '@/hooks/useTeams';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import EditMemberDialog from './EditMemberDialog';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

interface TeamMemberListProps {
  teamId: string;
  members: TeamMember[];
}

const TeamMemberList = ({ teamId, members }: TeamMemberListProps) => {
  const { removeMember } = useTeams();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);
  
  const handleDeleteMember = () => {
    if (deletingMember) {
      removeMember(teamId, deletingMember.id);
      setDeletingMember(null);
    }
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

  if (members.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <h3 className="font-medium">No team members yet</h3>
        <p className="text-muted-foreground">Add members to this team</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={member.role === 'Team Lead' ? 'default' : 'outline'}>
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>{member.position || 'N/A'}</TableCell>
                <TableCell>{member.joinedDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingMember(member)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeletingMember(member)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingMember && (
        <EditMemberDialog
          teamId={teamId}
          member={editingMember}
          open={!!editingMember}
          onOpenChange={(open) => !open && setEditingMember(null)}
        />
      )}

      {deletingMember && (
        <DeleteConfirmationDialog
          open={!!deletingMember}
          onOpenChange={(open) => !open && setDeletingMember(null)}
          onConfirm={handleDeleteMember}
          title="Remove Team Member"
          description={`Are you sure you want to remove ${deletingMember.name} from this team? This action cannot be undone.`}
        />
      )}
    </>
  );
};

export default TeamMemberList;
