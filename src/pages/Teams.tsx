
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Building, Loader2, Trash2, Edit } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTeams, CreateTeamData } from '@/hooks/useTeams';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Teams = () => {
  const { teams, isLoading, addTeam, updateTeam, deleteTeam, isCreating, isDeleting } = useTeams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateTeamData>({
    name: '',
    description: '',
    team_type: 'department' as const,
  });

  const totalMembers = teams.reduce((sum, team) => sum + (team.members?.length || 0), 0);
  const departments = [...new Set(teams.map(t => t.team_type))];

  const getTeamTypeColor = (type: string) => {
    switch (type) {
      case 'department':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'project':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'cross-functional':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleOpenForm = (team?: any) => {
    if (team) {
      setEditingTeam(team);
      setFormData({
        name: team.name,
        description: team.description || '',
        team_type: team.team_type,
      });
    } else {
      setEditingTeam(null);
      setFormData({ name: '', description: '', team_type: 'department' });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) return;

    if (editingTeam) {
      updateTeam({ id: editingTeam.id, updates: formData });
    } else {
      addTeam(formData);
    }
    setIsFormOpen(false);
    setEditingTeam(null);
    setFormData({ name: '', description: '', team_type: 'department' });
  };

  const handleDelete = (id: string) => {
    deleteTeam(id);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="Team Management"
        subtitle="Loading teams..."
        icon={<Users className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Team Management"
      subtitle="Manage teams, members, and organizational structure"
      icon={<Users className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">All Teams</Button>
            <Button variant="ghost" size="sm">Department</Button>
            <Button variant="ghost" size="sm">Project</Button>
            <Button variant="ghost" size="sm">Cross-functional</Button>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => handleOpenForm()}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            New Team
          </Button>
        </div>

        {/* Team Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teams.length}</div>
              <p className="text-xs text-muted-foreground">Across all departments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalMembers}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Different types</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teams.length > 0 ? Math.round(totalMembers / teams.length) : 0}
              </div>
              <p className="text-xs text-muted-foreground">Members per team</p>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        {teams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No teams yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first team.
              </p>
              <Button onClick={() => handleOpenForm()}>
                <Plus className="h-4 w-4 mr-2" />
                Create Team
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {teams.map((team) => (
              <Card key={team.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription>{team.description || 'No description'}</CardDescription>
                    </div>
                    <Badge className={getTeamTypeColor(team.team_type)}>
                      {team.team_type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Team Members Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Team Members ({team.members?.length || 0})
                      </span>
                    </div>
                    
                    {team.members && team.members.length > 0 ? (
                      <div className="space-y-2">
                        {team.members.slice(0, 3).map((member) => (
                          <div key={member.id} className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage 
                                src={member.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_id}`} 
                                alt={member.name || 'Member'} 
                              />
                              <AvatarFallback>
                                {(member.name || 'U').split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {member.name || member.email || 'Unknown User'}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {member.role} {member.position && `• ${member.position}`}
                              </p>
                            </div>
                          </div>
                        ))}
                        
                        {team.members.length > 3 && (
                          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                              <span className="text-xs">+{team.members.length - 3}</span>
                            </div>
                            <span>and {team.members.length - 3} more members</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No members yet</p>
                    )}
                  </div>

                  {/* Team Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOpenForm(team)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Member
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirmId(team.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common team management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-2 h-auto p-4"
                onClick={() => handleOpenForm()}
              >
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Create New Team</div>
                  <div className="text-sm text-muted-foreground">Set up a new team structure</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                <Plus className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Invite Members</div>
                  <div className="text-sm text-muted-foreground">Add new team members</div>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                <Building className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Org Chart</div>
                  <div className="text-sm text-muted-foreground">View organizational structure</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Team Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTeam ? 'Edit Team' : 'Create New Team'}</DialogTitle>
            <DialogDescription>
              {editingTeam ? 'Update team details.' : 'Add a new team to your organization.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Engineering Team"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the team's purpose..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="team_type">Team Type</Label>
              <Select
                value={formData.team_type}
                onValueChange={(value) => setFormData({ ...formData, team_type: value as 'department' | 'project' | 'cross-functional' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="department">Department</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="cross-functional">Cross-functional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!formData.name.trim() || isCreating}>
              {editingTeam ? 'Update' : 'Create'} Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this team? This will also remove all team members. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Teams;
