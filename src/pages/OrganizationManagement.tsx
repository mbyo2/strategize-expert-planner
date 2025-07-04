import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Plus, Search, Users, Mail, Shield } from 'lucide-react';
import { UserManagementService, OrganizationMember } from '@/services/userManagementService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const OrganizationManagement = () => {
  const { hasRole } = useSimpleAuth();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrganization, setSelectedOrganization] = useState<any>(null);
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [newOrganization, setNewOrganization] = useState({
    name: '',
    description: '',
    industry: '',
    size: '',
    website: ''
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'viewer'
  });

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (selectedOrganization) {
      loadOrganizationMembers(selectedOrganization.id);
      loadOrganizationInvitations(selectedOrganization.id);
    }
  }, [selectedOrganization]);

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const result = await UserManagementService.getOrganizations(1, 50);
      setOrganizations(result.organizations);
    } catch (error) {
      toast.error('Failed to load organizations');
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizationMembers = async (organizationId: string) => {
    try {
      const data = await UserManagementService.getOrganizationMembers(organizationId);
      setMembers(data);
    } catch (error) {
      console.error('Error loading organization members:', error);
    }
  };

  const loadOrganizationInvitations = async (organizationId: string) => {
    try {
      const data = await UserManagementService.getOrganizationInvitations(organizationId);
      setInvitations(data);
    } catch (error) {
      console.error('Error loading organization invitations:', error);
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrganization.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    try {
      await UserManagementService.createOrganization(newOrganization);
      await loadOrganizations();
      setIsCreateDialogOpen(false);
      setNewOrganization({
        name: '',
        description: '',
        industry: '',
        size: '',
        website: ''
      });
      toast.success('Organization created successfully');
    } catch (error) {
      toast.error('Failed to create organization');
      console.error('Error creating organization:', error);
    }
  };

  const handleInviteUser = async () => {
    if (!selectedOrganization || !inviteData.email.trim()) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      await UserManagementService.inviteToOrganization(
        selectedOrganization.id,
        inviteData.email,
        inviteData.role
      );
      await loadOrganizationInvitations(selectedOrganization.id);
      setIsInviteDialogOpen(false);
      setInviteData({ email: '', role: 'viewer' });
      toast.success('Invitation sent successfully');
    } catch (error) {
      toast.error('Failed to send invitation');
      console.error('Error sending invitation:', error);
    }
  };

  const handleUpdateMemberRole = async (userId: string, role: string) => {
    if (!selectedOrganization) return;

    try {
      await UserManagementService.updateOrganizationMemberRole(
        selectedOrganization.id,
        userId,
        role
      );
      await loadOrganizationMembers(selectedOrganization.id);
      toast.success('Member role updated successfully');
    } catch (error) {
      toast.error('Failed to update member role');
      console.error('Error updating member role:', error);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedOrganization) return;

    try {
      await UserManagementService.removeOrganizationMember(selectedOrganization.id, userId);
      await loadOrganizationMembers(selectedOrganization.id);
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error('Failed to remove member');
      console.error('Error removing member:', error);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!hasRole('manager')) {
    return (
      <PageLayout title="Access Denied" icon={<Shield className="h-6 w-6" />}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access organization management.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Organization Management" 
      subtitle="Manage organizations, members, and invitations" 
      icon={<Building2 className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Organization
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Organization</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    value={newOrganization.name}
                    onChange={(e) => setNewOrganization(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter organization name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrganization.description}
                    onChange={(e) => setNewOrganization(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter organization description"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={newOrganization.industry}
                      onChange={(e) => setNewOrganization(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="e.g., Technology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Select
                      value={newOrganization.size}
                      onValueChange={(value) => setNewOrganization(prev => ({ ...prev, size: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={newOrganization.website}
                    onChange={(e) => setNewOrganization(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleCreateOrganization} className="flex-1">
                    Create Organization
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Organizations List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Organizations</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {filteredOrganizations.map((org) => (
                    <div
                      key={org.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 border-l-2 ${
                        selectedOrganization?.id === org.id
                          ? 'border-primary bg-muted/50'
                          : 'border-transparent'
                      }`}
                      onClick={() => setSelectedOrganization(org)}
                    >
                      <div className="font-medium">{org.name}</div>
                      <div className="text-sm text-muted-foreground truncate">
                        {org.description || 'No description'}
                      </div>
                      {org.industry && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {org.industry}
                        </Badge>
                      )}
                    </div>
                  ))}
                  {filteredOrganizations.length === 0 && (
                    <div className="p-6 text-center text-muted-foreground">
                      No organizations found
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Details */}
          <div className="lg:col-span-2">
            {selectedOrganization ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{selectedOrganization.name}</CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {selectedOrganization.description || 'No description'}
                        </p>
                      </div>
                      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button>
                            <Mail className="h-4 w-4 mr-2" />
                            Invite Member
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invite Team Member</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="invite-email">Email Address</Label>
                              <Input
                                id="invite-email"
                                type="email"
                                value={inviteData.email}
                                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
                                placeholder="user@example.com"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="invite-role">Role</Label>
                              <Select
                                value={inviteData.role}
                                onValueChange={(role) => setInviteData(prev => ({ ...prev, role }))}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="analyst">Analyst</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={handleInviteUser} className="flex-1">
                                Send Invitation
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setIsInviteDialogOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {selectedOrganization.industry && (
                        <div>
                          <span className="font-medium">Industry:</span> {selectedOrganization.industry}
                        </div>
                      )}
                      {selectedOrganization.size && (
                        <div>
                          <span className="font-medium">Size:</span> {selectedOrganization.size}
                        </div>
                      )}
                      {selectedOrganization.website && (
                        <div>
                          <span className="font-medium">Website:</span>{' '}
                          <a
                            href={selectedOrganization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedOrganization.website}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Created:</span>{' '}
                        {new Date(selectedOrganization.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Members ({members.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Member</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {members.map((member) => (
                          <TableRow key={member.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">Member #{member.user_id.slice(0, 8)}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={member.role}
                                onValueChange={(role) => handleUpdateMemberRole(member.user_id, role)}
                                disabled={!hasRole('admin')}
                              >
                                <SelectTrigger className="w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="viewer">Viewer</SelectItem>
                                  <SelectItem value="analyst">Analyst</SelectItem>
                                  <SelectItem value="manager">Manager</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              {new Date(member.joined_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveMember(member.user_id)}
                                disabled={!hasRole('admin')}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        {members.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8">
                              No members found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Pending Invitations ({invitations.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {invitations.map((invitation) => (
                          <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{invitation.email}</div>
                              <div className="text-sm text-muted-foreground">
                                Role: {invitation.role} • Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline">Pending</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-lg font-semibold mb-2">Select an Organization</h2>
                    <p className="text-muted-foreground">
                      Choose an organization from the list to view its details and members.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OrganizationManagement;