import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Plus, Users, Target, Clock, Briefcase, Loader2 } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { usePlanningInitiatives } from '@/hooks/usePlanningInitiatives';
import { useStrategyReviews } from '@/hooks/useStrategyReviews';
import InitiativeFormDialog from '@/components/Planning/InitiativeFormDialog';
import ReviewFormDialog from '@/components/Planning/ReviewFormDialog';
import { PlanningInitiative } from '@/services/planningInitiativesService';
import { Progress } from '@/components/ui/progress';

const Planning = () => {
  const { initiatives, isLoading: initiativesLoading, createInitiative, updateInitiative, isCreating } = usePlanningInitiatives();
  const { reviews, isLoading: reviewsLoading, createReview, isCreating: isCreatingReview } = useStrategyReviews();
  
  const [initiativeDialogOpen, setInitiativeDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedInitiative, setSelectedInitiative] = useState<PlanningInitiative | undefined>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'planning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleCreateInitiative = () => {
    setSelectedInitiative(undefined);
    setInitiativeDialogOpen(true);
  };

  const handleEditInitiative = (initiative: PlanningInitiative) => {
    setSelectedInitiative(initiative);
    setInitiativeDialogOpen(true);
  };

  const handleSubmitInitiative = (data: Partial<PlanningInitiative>) => {
    if (selectedInitiative) {
      updateInitiative({ id: selectedInitiative.id, updates: data });
    } else {
      createInitiative(data as Omit<PlanningInitiative, 'id' | 'created_at' | 'updated_at'>);
    }
    setInitiativeDialogOpen(false);
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return '1 hour';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hour${hours > 1 ? 's' : ''}`;
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
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Planning Initiatives</h2>
                <p className="text-muted-foreground">Track strategic initiatives and their progress</p>
              </div>
              <Button className="flex items-center gap-2" onClick={handleCreateInitiative}>
                <Plus className="h-4 w-4" />
                New Initiative
              </Button>
            </div>

            {initiativesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : initiatives.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Initiatives Yet</h3>
                  <p className="text-muted-foreground mb-4">Create your first planning initiative to get started</p>
                  <Button onClick={handleCreateInitiative}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Initiative
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {initiatives.map((initiative) => (
                  <Card key={initiative.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{initiative.name}</CardTitle>
                          <CardDescription>{initiative.description || 'No description'}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(initiative.status)}>
                          {initiative.status.replace('-', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">{initiative.progress}%</span>
                        </div>
                        <Progress value={initiative.progress} className="h-2" />
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        {initiative.start_date && initiative.end_date && (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(initiative.start_date).toLocaleDateString()} - {new Date(initiative.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditInitiative(initiative)}>
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm">View Details</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Strategy Reviews</h2>
                <p className="text-muted-foreground">Schedule and manage strategic review sessions</p>
              </div>
              <Button className="flex items-center gap-2" onClick={() => setReviewDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Schedule Review
              </Button>
            </div>

            {reviewsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reviews Scheduled</h3>
                  <p className="text-muted-foreground mb-4">Schedule your first strategy review session</p>
                  <Button onClick={() => setReviewDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Review
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(review.scheduled_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDuration(review.duration_minutes)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {review.description && (
                        <p className="text-sm text-muted-foreground mb-4">{review.description}</p>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-6">
            <div className="space-y-1 mb-4">
              <h2 className="text-2xl font-bold">Strategic Roadmap</h2>
              <p className="text-muted-foreground">Visual timeline of your strategic initiatives</p>
            </div>

            {initiativesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : initiatives.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Initiatives to Display</h3>
                  <p className="text-muted-foreground mb-4">Create initiatives to see them on the roadmap</p>
                  <Button onClick={handleCreateInitiative}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Initiative
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Timeline */}
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-6">
                    {[...initiatives]
                      .sort((a, b) => {
                        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
                        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
                        return dateA - dateB;
                      })
                      .map((initiative) => {
                        const startDate = initiative.start_date ? new Date(initiative.start_date) : null;
                        const endDate = initiative.end_date ? new Date(initiative.end_date) : null;
                        const now = new Date();
                        const isOverdue = endDate && endDate < now && initiative.status !== 'completed';
                        const isActive = initiative.status === 'in-progress';

                        return (
                          <div key={initiative.id} className="relative pl-10">
                            {/* Dot on timeline */}
                            <div className={`absolute left-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-background ${
                              initiative.status === 'completed' ? 'bg-emerald-500' :
                              isOverdue ? 'bg-destructive' :
                              isActive ? 'bg-primary' : 'bg-muted-foreground'
                            }`} />

                            <Card className={`transition-shadow hover:shadow-md ${isActive ? 'border-primary/30' : ''}`}>
                              <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1 flex-1">
                                    <CardTitle className="text-base">{initiative.name}</CardTitle>
                                    {initiative.description && (
                                      <CardDescription className="line-clamp-2">{initiative.description}</CardDescription>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <Badge className={getStatusColor(initiative.status)}>
                                      {initiative.status.replace('-', ' ')}
                                    </Badge>
                                  </div>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  {startDate && (
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3.5 w-3.5" />
                                      <span>{startDate.toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {endDate && (
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3.5 w-3.5" />
                                      <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                                        {isOverdue ? 'Overdue: ' : 'Due: '}{endDate.toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Progress</span>
                                    <span className="font-medium">{initiative.progress}%</span>
                                  </div>
                                  <Progress value={initiative.progress} className="h-1.5" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <InitiativeFormDialog
        open={initiativeDialogOpen}
        onOpenChange={setInitiativeDialogOpen}
        initiative={selectedInitiative}
        onSubmit={handleSubmitInitiative}
        isSubmitting={isCreating}
      />

      <ReviewFormDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        onSubmit={createReview}
        isSubmitting={isCreatingReview}
      />
    </PageLayout>
  );
};

export default Planning;
