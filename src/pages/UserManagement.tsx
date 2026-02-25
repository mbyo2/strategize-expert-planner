import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, UserPlus, MoreHorizontal, Shield, Activity, Mail, Clock, X } from 'lucide-react';
import { UserManagementService, UserWithDetails, ActivityLog } from '@/services/userManagementService';
import { InvitationService, Invitation } from '@/services/invitationService';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { useOrganization } from '@/contexts/OrganizationContext';
import { toast } from 'sonner';
import PageLayout from '@/components/PageLayout';

const UserManagement = () => {
  const { hasRole } = useSimpleAuth();
  const { organizationId } = useOrganization();
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('viewer');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    loadUsers();
    loadActivityLogs();
    loadInvitations();
  }, [pagination.page, organizationId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await UserManagementService.getAllUsers(pagination.page, 20);
      setUsers(result.users);
      setPagination({
        page: result.page,
        totalPages: result.totalPages,
        total: result.total
      });
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvitations = async () => {
    if (!organizationId) return;
    try {
      const result = await InvitationService.getPendingInvitations(organizationId);
      setInvitations(result);
    } catch (error) {
      console.error('Error loading invitations:', error);
    }
  };

  const handleSendInvitation = async () => {
    if (!inviteEmail || !organizationId) return;
    try {
      setInviting(true);
      await InvitationService.createInvitation(organizationId, inviteEmail, inviteRole);
      await UserManagementService.logActivity(
        'invitation_sent',
        'invitation',
        `Invitation sent to ${inviteEmail} with role ${inviteRole}`,
        {}
      );
      toast.success(`Invitation sent to ${inviteEmail}`);
      setIsInviteDialogOpen(false);
      setInviteEmail('');
      setInviteRole('viewer');
      loadInvitations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRevokeInvitation = async (id: string) => {
    try {
      await InvitationService.revokeInvitation(id);
      toast.success('Invitation revoked');
      loadInvitations();
    } catch {
      toast.error('Failed to revoke invitation');
    }
  };

  const loadActivityLogs = async () => {
    try {
      const result = await UserManagementService.getActivityLogs({}, 1, 10);
      setActivities(result.activities as ActivityLog[]);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    }
  };

  const handleUserStatusChange = async (userId: string, status: string) => {
    try {
      await UserManagementService.updateUserStatus(userId, status);
      await loadUsers();
      await UserManagementService.logActivity(
        'user_status_updated',
        'user',
        `User status changed to ${status}`,
        { resourceId: userId }
      );
      toast.success('User status updated successfully');
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const handleUserRoleChange = async (userId: string, role: string) => {
    try {
      await UserManagementService.updateUserRole(userId, role);
      await loadUsers();
      await UserManagementService.logActivity(
        'user_role_updated',
        'user',
        `User role changed to ${role}`,
        { resourceId: userId }
      );
      toast.success('User role updated successfully');
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      case 'analyst': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  if (!hasRole('manager')) {
    return (
      <PageLayout title="Access Denied" icon={<Shield className="h-6 w-6" />}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">You don't have permission to access user management.</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="User Management" subtitle="Manage users, roles, and permissions" icon={<Users className="h-6 w-6" />}>
      <div className="space-y-6">
        <div className="flex items-center justify-end">
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invite-role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
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
                  <Button
                    onClick={handleSendInvitation}
                    className="flex-1"
                    disabled={!inviteEmail || inviting}
                  >
                    {inviting ? 'Sending...' : 'Send Invitation'}
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

        <Tabs defaultValue="users" className="w-full">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="invitations">
              Invitations {invitations.length > 0 && <Badge variant="secondary" className="ml-1">{invitations.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>All Users ({pagination.total})</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar || ''} />
                                <AvatarFallback>
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name || 'Unknown'}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.job_title || 'No title'}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Select
                              value={user.role || 'viewer'}
                              onValueChange={(role) => handleUserRoleChange(user.id, role)}
                              disabled={!hasRole('admin')}
                            >
                              <SelectTrigger className="w-24">
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
                            <Select
                              value={user.status || 'active'}
                              onValueChange={(status) => handleUserStatusChange(user.id, status)}
                            >
                              <SelectTrigger className="w-28">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                <SelectItem value="suspended">Suspended</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                      >
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invitations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Pending Invitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                {invitations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Mail className="h-12 w-12 mx-auto mb-4" />
                    <p>No pending invitations</p>
                    <p className="text-sm">Invite users to join your organization</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Expires</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invitations.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">{inv.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(inv.expires_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {inv.created_at ? new Date(inv.created_at).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRevokeInvitation(inv.id)}
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Activity className="h-4 w-4 text-muted-foreground mt-1" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium">{activity.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.action}</span>
                          <span>•</span>
                          <span>{new Date(activity.created_at).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No recent activity
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default UserManagement;