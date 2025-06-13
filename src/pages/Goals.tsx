
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, TrendingUp, Clock, User } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Goals = () => {
  const [goals] = useState([
    {
      id: 1,
      name: 'Market Expansion Initiative',
      description: 'Expand into three new regional markets by Q4',
      progress: 65,
      status: 'on-track',
      owner: 'Sarah Johnson',
      dueDate: '2024-12-31',
      category: 'Growth',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Customer Satisfaction Improvement',
      description: 'Increase NPS score from 7.2 to 8.5',
      progress: 42,
      status: 'in-progress',
      owner: 'Mike Chen',
      dueDate: '2024-09-30',
      category: 'Customer',
      priority: 'high'
    },
    {
      id: 3,
      name: 'Digital Transformation',
      description: 'Modernize core systems and processes',
      progress: 78,
      status: 'on-track',
      owner: 'Alex Rivera',
      dueDate: '2024-11-15',
      category: 'Technology',
      priority: 'medium'
    },
    {
      id: 4,
      name: 'Team Training Program',
      description: 'Complete skills development for all team leads',
      progress: 23,
      status: 'at-risk',
      owner: 'Lisa Park',
      dueDate: '2024-08-31',
      category: 'People',
      priority: 'medium'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'at-risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <PageLayout 
      title="Strategic Goals"
      subtitle="Track and manage your organization's strategic objectives"
      icon={<Target className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">All Goals</Button>
            <Button variant="ghost" size="sm">On Track</Button>
            <Button variant="ghost" size="sm">At Risk</Button>
            <Button variant="ghost" size="sm">Completed</Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Goals Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">4 active this quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">52%</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Goals at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">1</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{goal.name}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(goal.status)}>
                      {goal.status.replace('-', ' ')}
                    </Badge>
                    <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                      {goal.priority} priority
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {/* Goal Details */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{goal.owner}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Due {new Date(goal.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{goal.category}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">View Details</Button>
                  <Button variant="ghost" size="sm">Update Progress</Button>
                  <Button variant="ghost" size="sm">Add Note</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Goals;
