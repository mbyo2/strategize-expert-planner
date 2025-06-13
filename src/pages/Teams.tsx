
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Mail, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'away' | 'offline';
  avatar?: string;
  joinDate: string;
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'Strategic Analyst',
    department: 'Strategy',
    status: 'active',
    joinDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'Planning Manager',
    department: 'Operations',
    status: 'active',
    joinDate: '2022-11-20'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    role: 'Data Analyst',
    department: 'Analytics',
    status: 'away',
    joinDate: '2023-03-10'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'Project Coordinator',
    department: 'Operations',
    status: 'offline',
    joinDate: '2023-02-05'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500';
    case 'away':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

const Teams = () => {
  return (
    <PageLayout 
      title="Teams & Collaboration" 
      subtitle="Manage team members, roles, and collaborative workspaces"
      icon={<Users className="h-6 w-6" />}
    >
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Team Members</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your team members and their roles
                </p>
              </div>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockTeamMembers.map((member) => (
                <Card key={member.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base">{member.name}</CardTitle>
                        <p className="text-sm text-muted-foreground truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm truncate">{member.email}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{member.department}</Badge>
                        <Badge 
                          className={
                            member.status === 'active' ? 'bg-green-100 text-green-800' :
                            member.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        >
                          {member.status}
                        </Badge>
                      </div>
                      
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="departments">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {['Strategy', 'Operations', 'Analytics', 'Marketing', 'Finance', 'HR'].map((dept) => (
              <Card key={dept}>
                <CardHeader>
                  <CardTitle className="text-base">{dept}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {mockTeamMembers.filter(m => m.department === dept).length} members
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">Active</Badge>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Configure what each role can access and modify
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Admin', 'Manager', 'Analyst', 'Viewer'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{role}</h4>
                      <p className="text-sm text-muted-foreground">
                        {role === 'Admin' ? 'Full system access' :
                         role === 'Manager' ? 'Team management and reporting' :
                         role === 'Analyst' ? 'Data analysis and insights' :
                         'View-only access'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Team Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Collaboration Tools</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      Enable Real-time Collaboration
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Configure Notifications
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      Team Communication Settings
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Teams;
