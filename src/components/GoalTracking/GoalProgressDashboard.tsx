
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Clock, CheckCircle } from "lucide-react";

// Mock data for demonstration
const mockGoals = [
  {
    id: 1,
    title: "Increase Market Share",
    description: "Expand market presence by 15% in Q1",
    progress: 75,
    target: 15,
    current: 11.25,
    unit: "%",
    status: "on-track",
    dueDate: "2024-03-31",
    category: "Growth"
  },
  {
    id: 2,
    title: "Revenue Growth",
    description: "Achieve $2M revenue target",
    progress: 60,
    target: 2000000,
    current: 1200000,
    unit: "$",
    status: "behind",
    dueDate: "2024-06-30",
    category: "Financial"
  },
  {
    id: 3,
    title: "Customer Satisfaction",
    description: "Maintain 95% customer satisfaction score",
    progress: 90,
    target: 95,
    current: 85.5,
    unit: "%",
    status: "at-risk",
    dueDate: "2024-12-31",
    category: "Quality"
  }
];

const GoalProgressDashboard = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-green-500';
      case 'behind': return 'bg-red-500';
      case 'at-risk': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return <Badge className="bg-green-100 text-green-800">On Track</Badge>;
      case 'behind': return <Badge className="bg-red-100 text-red-800">Behind</Badge>;
      case 'at-risk': return <Badge className="bg-yellow-100 text-yellow-800">At Risk</Badge>;
      default: return <Badge>Unknown</Badge>;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === '$') {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `${value}${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGoals.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Track</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockGoals.filter(g => g.status === 'on-track').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockGoals.filter(g => g.status === 'at-risk').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockGoals.reduce((acc, goal) => acc + goal.progress, 0) / mockGoals.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Goal Progress</h3>
        {mockGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </div>
                {getStatusBadge(goal.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progress: {formatValue(goal.current, goal.unit)} / {formatValue(goal.target, goal.unit)}</span>
                <span>Due: {goal.dueDate}</span>
              </div>
              
              <Progress 
                value={goal.progress} 
                className="h-3"
              />
              
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{goal.progress}% Complete</span>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GoalProgressDashboard;
