
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Users, Calendar, BarChart3, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const metrics = [
    {
      title: "Active Goals",
      value: "12",
      change: "+2 this month",
      icon: Target,
      trend: "up"
    },
    {
      title: "Team Members",
      value: "24",
      change: "+3 this quarter",
      icon: Users,
      trend: "up"
    },
    {
      title: "Completion Rate",
      value: "78%",
      change: "+5% this month",
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Upcoming Milestones",
      value: "8",
      change: "Next 30 days",
      icon: Calendar,
      trend: "neutral"
    }
  ];

  const recentGoals = [
    {
      id: 1,
      title: "Increase Market Share",
      progress: 75,
      status: "On Track",
      dueDate: "2024-03-15"
    },
    {
      id: 2,
      title: "Launch New Product Line",
      progress: 45,
      status: "In Progress", 
      dueDate: "2024-04-20"
    },
    {
      id: 3,
      title: "Improve Customer Satisfaction",
      progress: 90,
      status: "Near Completion",
      dueDate: "2024-02-28"
    }
  ];

  const upcomingTasks = [
    { id: 1, title: "Review Q1 Strategy", due: "Today", priority: "high" },
    { id: 2, title: "Team Performance Meeting", due: "Tomorrow", priority: "medium" },
    { id: 3, title: "Budget Analysis Report", due: "This Week", priority: "high" },
    { id: 4, title: "Market Research Update", due: "Next Week", priority: "low" }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Strategic Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentGoals.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">{goal.title}</h4>
                    <Badge 
                      variant={
                        goal.status === "On Track" ? "default" :
                        goal.status === "Near Completion" ? "secondary" : 
                        "outline"
                      }
                    >
                      {goal.status}
                    </Badge>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{goal.progress}% complete</span>
                    <span>Due: {new Date(goal.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">{task.due}</p>
                  </div>
                  <Badge 
                    variant={
                      task.priority === "high" ? "destructive" :
                      task.priority === "medium" ? "default" : 
                      "secondary"
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Quick Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <p className="text-sm text-muted-foreground">Goals On Track</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">12.5%</div>
              <p className="text-sm text-muted-foreground">Revenue Growth</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">4.2</div>
              <p className="text-sm text-muted-foreground">Team Efficiency Score</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
