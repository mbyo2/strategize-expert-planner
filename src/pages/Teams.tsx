
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Plus, Mail, Phone, MapPin, Building } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Teams = () => {
  const [teams] = useState([
    {
      id: 1,
      name: 'Product Strategy',
      description: 'Responsible for product roadmap and strategic direction',
      memberCount: 8,
      department: 'Product',
      lead: {
        name: 'Sarah Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
        role: 'VP Product Strategy'
      },
      members: [
        { name: 'Mike Chen', role: 'Senior Product Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
        { name: 'Lisa Park', role: 'Product Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
        { name: 'Alex Rivera', role: 'UX Researcher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex' }
      ]
    },
    {
      id: 2,
      name: 'Engineering',
      description: 'Build and maintain our technology platform',
      memberCount: 12,
      department: 'Technology',
      lead: {
        name: 'David Kumar',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
        role: 'Engineering Director'
      },
      members: [
        { name: 'Emma Wilson', role: 'Senior Developer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
        { name: 'Tom Anderson', role: 'DevOps Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom' },
        { name: 'Maria Garcia', role: 'Frontend Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' }
      ]
    },
    {
      id: 3,
      name: 'Marketing',
      description: 'Drive growth through strategic marketing initiatives',
      memberCount: 6,
      department: 'Marketing',
      lead: {
        name: 'Jessica Taylor',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica',
        role: 'Marketing Director'
      },
      members: [
        { name: 'Ryan Brooks', role: 'Content Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ryan' },
        { name: 'Sophie Zhang', role: 'Growth Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie' },
        { name: 'James Lee', role: 'Brand Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james' }
      ]
    },
    {
      id: 4,
      name: 'Sales',
      description: 'Drive revenue growth and customer acquisition',
      memberCount: 10,
      department: 'Sales',
      lead: {
        name: 'Robert Martinez',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
        role: 'Sales Director'
      },
      members: [
        { name: 'Anna Smith', role: 'Senior Account Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna' },
        { name: 'Chris Brown', role: 'Sales Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris' },
        { name: 'Nina Patel', role: 'Business Development', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina' }
      ]
    }
  ]);

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Product':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Technology':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Marketing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Sales':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
            <Button variant="ghost" size="sm">Product</Button>
            <Button variant="ghost" size="sm">Engineering</Button>
            <Button variant="ghost" size="sm">Marketing</Button>
            <Button variant="ghost" size="sm">Sales</Button>
          </div>
          <Button className="flex items-center gap-2">
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
              <div className="text-2xl font-bold">{teams.reduce((sum, team) => sum + team.memberCount, 0)}</div>
              <p className="text-xs text-muted-foreground">Active team members</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg Team Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">9</div>
              <p className="text-xs text-muted-foreground">Members per team</p>
            </CardContent>
          </Card>
        </div>

        {/* Teams Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {teams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                    <CardDescription>{team.description}</CardDescription>
                  </div>
                  <Badge className={getDepartmentColor(team.department)}>
                    {team.department}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Lead */}
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={team.lead.avatar} alt={team.lead.name} />
                    <AvatarFallback>{team.lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{team.lead.name}</p>
                    <p className="text-sm text-muted-foreground">{team.lead.role}</p>
                  </div>
                  <Badge variant="outline">Lead</Badge>
                </div>

                {/* Team Members Preview */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Team Members ({team.memberCount})</span>
                    <Button variant="ghost" size="sm">View All</Button>
                  </div>
                  
                  <div className="space-y-2">
                    {team.members.map((member, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                        </div>
                      </div>
                    ))}
                    
                    {team.memberCount > 3 && (
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs">+{team.memberCount - 3}</span>
                        </div>
                        <span>and {team.memberCount - 3} more members</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Team Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">View Team</Button>
                  <Button variant="ghost" size="sm">Add Member</Button>
                  <Button variant="ghost" size="sm">Settings</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common team management tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
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
    </PageLayout>
  );
};

export default Teams;
