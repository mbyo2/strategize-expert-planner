import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  FolderPlus, 
  Calendar, 
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Target,
  TrendingUp
} from 'lucide-react';
import { useProjectMetrics } from '@/hooks/useERPMetrics';
import { useOrganizations } from '@/hooks/useOrganizations';

export const ProjectModule: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const organizationId = currentOrganization?.id || '';
  const { metrics, isLoading } = useProjectMetrics(organizationId);

  const hasData = metrics.projects.length > 0;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'on_hold': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'on_track': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'at_risk': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'on_hold': return 'bg-orange-100 text-orange-700';
      case 'on_track': return 'bg-green-100 text-green-700';
      case 'at_risk': return 'bg-orange-100 text-orange-700';
      default: return 'bg-muted text-muted-foreground';
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
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <>
                <div className="text-2xl font-bold">{metrics.activeProjects}</div>
                <p className="text-xs text-muted-foreground">{metrics.onTimeRate}% on time</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-20" /> : (
              <>
                <div className="text-2xl font-bold">{formatCurrency(metrics.totalBudget)}</div>
                <p className="text-xs text-muted-foreground">Across all projects</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-16" /> : (
              <>
                <div className="text-2xl font-bold">{metrics.avgCompletion}%</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.avgCompletion >= 50 && <TrendingUp className="inline w-3 h-3 mr-1 text-green-500" />}
                  {metrics.avgCompletion >= 50 ? 'On track' : 'In progress'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? <Skeleton className="h-8 w-12" /> : (
              <>
                <div className="text-2xl font-bold">{metrics.completedProjects}</div>
                <p className="text-xs text-muted-foreground">Projects finished</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Portfolio</CardTitle>
              <CardDescription>Manage and track all organizational projects</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
                </div>
              ) : metrics.projects.length === 0 ? (
                <div className="text-center p-8">
                  <FolderPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No projects found</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create your first project to start tracking work
                  </p>
                  <Button>Create Project</Button>
                </div>
              ) : (
                <div className="space-y-6">
                  {metrics.projects.map((project) => (
                    <div key={project.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(project.status)}
                          <div>
                            <h3 className="font-medium">{project.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Manager: {project.manager} {project.team > 0 && `• Team: ${project.team} members`}
                            </p>
                            {(project.startDate || project.endDate) && (
                              <div className="text-xs text-muted-foreground">
                                {project.startDate} {project.endDate && `- ${project.endDate}`}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(project.status)}>{project.status}</Badge>
                          {project.budget > 0 && (
                            <div className="text-sm text-muted-foreground mt-1">
                              {formatCurrency(project.spent)}/{formatCurrency(project.budget)}
                            </div>
                          )}
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
                        
                        {project.budget > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Budget Utilization</span>
                              <span>{Math.round((project.spent / project.budget) * 100)}%</span>
                            </div>
                            <Progress value={(project.spent / project.budget) * 100} className="w-full" />
                          </div>
                        )}
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
              <CardDescription>Track key project milestones and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
                </div>
              ) : metrics.milestones.length === 0 ? (
                <div className="text-center p-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No milestones found</div>
                  <p className="text-sm text-muted-foreground">
                    Milestones will appear here when added to projects
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(milestone.status)}
                        <div>
                          <div className="font-medium">{milestone.milestone}</div>
                          <div className="text-sm text-muted-foreground">{milestone.project}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        {milestone.dueDate && <div className="text-sm font-medium">{milestone.dueDate}</div>}
                        <Badge className={getStatusColor(milestone.status)}>
                          {milestone.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
              <CardDescription>Manage project team members and resource allocation</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
                </div>
              ) : metrics.teamMembers.length === 0 ? (
                <div className="text-center p-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <div className="text-muted-foreground mb-4">No team members found</div>
                  <p className="text-sm text-muted-foreground">
                    Add team members to projects to track allocation
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {metrics.teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};