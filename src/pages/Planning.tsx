
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Users, Target, Clock, Briefcase } from 'lucide-react';
import PageLayout from '@/components/PageLayout';

const Planning = () => {
  const [initiatives] = useState([
    {
      id: 1,
      name: 'Digital Transformation',
      description: 'Modernize core business systems and processes',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      owner: 'Tech Team',
      phase: 'Implementation'
    },
    {
      id: 2,
      name: 'Customer Experience Enhancement',
      description: 'Improve customer touchpoints and satisfaction',
      status: 'planning',
      progress: 25,
      startDate: '2024-03-01',
      endDate: '2024-10-31',
      owner: 'CX Team',
      phase: 'Analysis'
    },
    {
      id: 3,
      name: 'Market Expansion Strategy',
      description: 'Enter three new regional markets',
      status: 'approved',
      progress: 10,
      startDate: '2024-04-01',
      endDate: '2024-12-31',
      owner: 'Sales Team',
      phase: 'Planning'
    }
  ]);

  const [upcomingReviews] = useState([
    {
      id: 1,
      title: 'Q2 Strategic Review',
      date: '2024-06-15',
      duration: '2 hours',
      participants: 8,
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Digital Transformation Milestone',
      date: '2024-06-20',
      duration: '1 hour',
      participants: 5,
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Market Analysis Review',
      date: '2024-06-25',
      duration: '1.5 hours',
      participants: 6,
      status: 'draft'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <PageLayout 
      title="Strategic Planning"
      subtitle="Manage initiatives, roadmaps, and strategic reviews"
      icon={<Briefcase className="h-6 w-6" />}
    >
      <div className="space-y-6">
        <Tabs defaultValue="initiatives" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="initiatives" className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Planning Initiatives</h2>
                <p className="text-muted-foreground">Track strategic initiatives and their progress</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Initiative
              </Button>
            </div>

            {/* Initiatives Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {initiatives.map((initiative) => (
                <Card key={initiative.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{initiative.name}</CardTitle>
                        <CardDescription>{initiative.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(initiative.status)}>
                        {initiative.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{initiative.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${initiative.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{initiative.owner}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(initiative.startDate).toLocaleDateString()} - {new Date(initiative.endDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        <span>Phase: {initiative.phase}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      <Button variant="ghost" size="sm">Update</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Strategy Reviews</h2>
                <p className="text-muted-foreground">Schedule and manage strategic review sessions</p>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule Review
              </Button>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {upcomingReviews.map((review) => (
                <Card key={review.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{review.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{review.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(review.status)}>
                        {review.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">View Agenda</Button>
                      <Button variant="ghost" size="sm">Edit</Button>
                      <Button variant="ghost" size="sm">Send Invites</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Strategic Roadmap</h3>
              <p className="text-muted-foreground mb-4">
                Visual timeline of your strategic initiatives coming soon
              </p>
              <Button variant="outline">Request Feature</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Planning;
