import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  FolderPlus, 
  Calendar, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Target,
  TrendingUp,
  FileText
} from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ProjectModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const { entities: projects, isLoading } = useERPEntities(
    currentOrganization?.id || '',
    'project',
    'project'
  );

  const mockProjectData = {
    activeProjects: 12,
    totalBudget: 2850000,
    avgCompletion: 67,
    onTimeProjects: 75,
    totalTasks: 324,
    completedTasks: 218,
    projects: [
      { 
        id: 'PROJ-001', 
        name: 'Digital Transformation Initiative', 
        manager: 'Sarah Johnson',
        status: 'active', 
        progress: 78,
        budget: 450000,
        spent: 285000,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        team: 8
      },
      { 
        id: 'PROJ-002', 
        name: 'Customer Portal Redesign', 
        manager: 'Mike Chen',
        status: 'active', 
        progress: 45,
        budget: 180000,
        spent: 78000,
        startDate: '2024-01-15',
        endDate: '2024-04-15',
        team: 5
      },
      { 
        id: 'PROJ-003', 
        name: 'Supply Chain Optimization', 
        manager: 'Emily Davis',
        status: 'completed', 
        progress: 100,
        budget: 320000,
        spent: 315000,
        startDate: '2023-09-01',
        endDate: '2024-01-15',
        team: 12
      }
    ],
    milestones: [
      { 
        project: 'Digital Transformation', 
        milestone: 'Phase 1 Complete', 
        dueDate: '2024-01-20', 
        status: 'on_track' 
      },
      { 
        project: 'Customer Portal', 
        milestone: 'Design Review', 
        dueDate: '2024-01-18', 
        status: 'at_risk' 
      },
      { 
        project: 'Supply Chain', 
        milestone: 'Final Testing', 
        dueDate: '2024-01-15', 
        status: 'completed' 
      }
    ],
    teamMembers: [
      { 
        id: '1', 
        name: 'Alice Wilson', 
        role: 'Senior Developer', 
        projects: 3, 
        utilization: 85,
        avatar: '/api/placeholder/32/32'
      },
      { 
        id: '2', 
        name: 'Bob Martinez', 
        role: 'Project Coordinator', 
        projects: 5, 
        utilization: 92,
        avatar: '/api/placeholder/32/32'
      },
      { 
        id: '3', 
        name: 'Carol Thompson', 
        role: 'Business Analyst', 
        projects: 2, 
        utilization: 78,
        avatar: '/api/placeholder/32/32'
      }
    ],
    recentActivity: [
      { type: 'milestone', project: 'Digital Transformation', description: 'Phase 1 milestone completed', date: '2024-01-15', user: 'Sarah Johnson' },
      { type: 'task', project: 'Customer Portal', description: 'UI mockups approved', date: '2024-01-14', user: 'Mike Chen' },
      { type: 'budget', project: 'Supply Chain', description: 'Budget variance analysis completed', date: '2024-01-13', user: 'Emily Davis' }
    ]
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'on_hold': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'on_track': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'at_risk': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'on_hold': return 'bg-orange-100 text-orange-700';
      case 'on_track': return 'bg-green-100 text-green-700';
      case 'at_risk': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'milestone': return <Target className="w-4 h-4 text-blue-500" />;
      case 'task': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'budget': return <DollarSign className="w-4 h-4 text-orange-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <Button>
          <FolderPlus className="w-4 h-4 mr-2" />
          Create Project
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjectData.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              {mockProjectData.onTimeProjects}% on time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockProjectData.totalBudget / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              Across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjectData.avgCompletion}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />
              Above target
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockProjectData.completedTasks}/{mockProjectData.totalTasks}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockProjectData.completedTasks / mockProjectData.totalTasks) * 100)}% complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>
                Manage and track all organizational projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="text-muted-foreground">Loading projects...</div>
                </div>
              ) : (
                <div className="space-y-6">
                  {mockProjectData.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(project.status)}
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Manager: {project.manager} • Team: {project.team} members
                            </p>
                            <div className="text-xs text-muted-foreground">
                              {project.startDate} - {project.endDate}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            ${project.spent.toLocaleString()}/${project.budget.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="w-full" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Budget Utilization</span>
                            <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                          </div>
                          <Progress value={(project.spent / project.budget) * 100} className="w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Milestones</CardTitle>
              <CardDescription>
                Track key project milestones and deadlines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectData.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(milestone.status)}
                      <div>
                        <div className="font-medium">{milestone.milestone}</div>
                        <div className="text-sm text-muted-foreground">{milestone.project}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{milestone.dueDate}</div>
                      <Badge className={getStatusColor(milestone.status)}>
                        {milestone.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>
                Manage project team members and resource allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectData.teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                        <div className="text-xs text-muted-foreground">
                          {member.projects} active projects
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{member.utilization}%</div>
                      <div className="text-xs text-muted-foreground">Utilization</div>
                      <Progress value={member.utilization} className="w-20 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Track recent project activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjectData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center space-x-3">
                      {getActivityIcon(activity.type)}
                      <div>
                        <div className="font-medium">{activity.project}</div>
                        <div className="text-sm text-muted-foreground">{activity.description}</div>
                        <div className="text-xs text-muted-foreground">by {activity.user}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {activity.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};