
import React, { useState } from 'react';
import { Target, ChevronRight, Check, ArrowUpRight, Circle, Clock, AlertCircle, Plus } from 'lucide-react';
import PageLayout from '../components/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from '@/components/ui/pagination';

interface Goal {
  id: string;
  title: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'at-risk';
  startDate: string;
  targetDate: string;
  owner: string;
  pillar: string;
  keyResults: {
    id: string;
    text: string;
    status: 'completed' | 'in-progress' | 'at-risk';
  }[];
}

const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Increase Market Share to 25%',
    progress: 72,
    status: 'in-progress',
    startDate: 'Jan 15, 2023',
    targetDate: 'Dec 31, 2023',
    owner: 'Sarah Johnson',
    pillar: 'Market Leadership',
    keyResults: [
      { id: '1-1', text: 'Launch new product in premium segment', status: 'completed' },
      { id: '1-2', text: 'Expand sales team by 15%', status: 'completed' },
      { id: '1-3', text: 'Secure 3 enterprise reference customers (2/3 Complete)', status: 'in-progress' },
      { id: '1-4', text: 'Implement partner certification program', status: 'in-progress' }
    ]
  },
  {
    id: '2',
    title: 'Achieve 95% Customer Satisfaction Rating',
    progress: 45,
    status: 'at-risk',
    startDate: 'Feb 1, 2023',
    targetDate: 'Dec 31, 2023',
    owner: 'Michael Chen',
    pillar: 'Operational Excellence',
    keyResults: [
      { id: '2-1', text: 'Implement new customer feedback system', status: 'completed' },
      { id: '2-2', text: 'Reduce average support response time to &lt; 2 hours', status: 'in-progress' },
      { id: '2-3', text: 'Achieve 90% first-contact resolution', status: 'at-risk' },
      { id: '2-4', text: 'Launch customer success program for top accounts', status: 'in-progress' }
    ]
  },
  {
    id: '3',
    title: 'Reduce Operating Costs by 15%',
    progress: 58,
    status: 'in-progress',
    startDate: 'Mar 10, 2023',
    targetDate: 'Feb 28, 2024',
    owner: 'David Wilson',
    pillar: 'Operational Excellence',
    keyResults: [
      { id: '3-1', text: 'Consolidate office locations', status: 'completed' },
      { id: '3-2', text: 'Implement new procurement system', status: 'completed' },
      { id: '3-3', text: 'Automate key operational processes', status: 'in-progress' },
      { id: '3-4', text: 'Renegotiate key vendor contracts', status: 'in-progress' }
    ]
  },
  {
    id: '4',
    title: 'Launch Innovation Lab',
    progress: 100,
    status: 'completed',
    startDate: 'Jan 5, 2023',
    targetDate: 'Sep 30, 2023',
    owner: 'Jessica Martinez',
    pillar: 'Innovation',
    keyResults: [
      { id: '4-1', text: 'Secure budget approval', status: 'completed' },
      { id: '4-2', text: 'Hire innovation team lead', status: 'completed' },
      { id: '4-3', text: 'Setup physical lab space', status: 'completed' },
      { id: '4-4', text: 'Launch first innovation challenge', status: 'completed' }
    ]
  }
];

// Additional goals that will be shown when clicking "Load More Goals"
const additionalGoals: Goal[] = [
  {
    id: '5',
    title: 'Develop Sustainability Initiative',
    progress: 30,
    status: 'in-progress',
    startDate: 'Apr 1, 2023',
    targetDate: 'Mar 31, 2024',
    owner: 'Elena Rodriguez',
    pillar: 'Corporate Responsibility',
    keyResults: [
      { id: '5-1', text: 'Complete sustainability audit', status: 'completed' },
      { id: '5-2', text: 'Develop carbon reduction plan', status: 'in-progress' },
      { id: '5-3', text: 'Implement recycling program across all locations', status: 'in-progress' },
      { id: '5-4', text: 'Publish first annual sustainability report', status: 'in-progress' }
    ]
  },
  {
    id: '6',
    title: 'Expand to European Market',
    progress: 15,
    status: 'in-progress',
    startDate: 'Jun 15, 2023',
    targetDate: 'Jun 30, 2024',
    owner: 'Thomas Weber',
    pillar: 'Market Leadership',
    keyResults: [
      { id: '6-1', text: 'Complete market research study', status: 'completed' },
      { id: '6-2', text: 'Establish legal entity in EU', status: 'in-progress' },
      { id: '6-3', text: 'Hire regional sales director', status: 'in-progress' },
      { id: '6-4', text: 'Launch localized product offering', status: 'in-progress' }
    ]
  }
];

type FilterStatus = 'all' | 'completed' | 'in-progress' | 'at-risk';

const Goals = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [viewingGoal, setViewingGoal] = useState<Goal | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(true);
  
  const form = useForm({
    defaultValues: {
      title: '',
      owner: '',
      pillar: '',
      startDate: '',
      targetDate: '',
      description: ''
    }
  });

  const filteredGoals = filter === 'all' 
    ? goals 
    : goals.filter(goal => goal.status === filter);

  const handleFilterClick = (newFilter: FilterStatus) => {
    setFilter(newFilter);
  };

  const handleViewDetails = (goal: Goal) => {
    setViewingGoal(goal);
  };

  const handleLoadMore = () => {
    setGoals([...goals, ...additionalGoals]);
    setShowLoadMore(false);
  };

  const handleAddNewGoal = (data: any) => {
    const newGoal: Goal = {
      id: `${goals.length + 1}`,
      title: data.title,
      progress: 0,
      status: 'in-progress',
      startDate: data.startDate,
      targetDate: data.targetDate,
      owner: data.owner,
      pillar: data.pillar,
      keyResults: []
    };
    
    setGoals([newGoal, ...goals]);
    form.reset();
  };

  const getStatusIcon = (status: 'completed' | 'in-progress' | 'at-risk') => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500 mt-0.5" />;
      case 'in-progress':
        return <Circle className="h-4 w-4 text-blue-500 mt-0.5" />;
      case 'at-risk':
        return <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />;
      default:
        return <Circle className="h-4 w-4 text-blue-500 mt-0.5" />;
    }
  };

  const getStatusBadge = (status: 'completed' | 'in-progress' | 'at-risk') => {
    switch(status) {
      case 'completed':
        return (
          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
            Completed
          </span>
        );
      case 'in-progress':
        return (
          <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full">
            In Progress
          </span>
        );
      case 'at-risk':
        return (
          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-1 rounded-full">
            At Risk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout 
      title="Strategic Goals" 
      subtitle="Set, track, and achieve your organization's key objectives"
    >
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div className="flex space-x-2 flex-wrap gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterClick('all')}
          >
            <Clock className="h-4 w-4 mr-1" /> All
          </Button>
          <Button 
            variant={filter === 'completed' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterClick('completed')}
          >
            <Check className="h-4 w-4 mr-1" /> Completed
          </Button>
          <Button 
            variant={filter === 'in-progress' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterClick('in-progress')}
          >
            <Circle className="h-4 w-4 mr-1" /> In Progress
          </Button>
          <Button 
            variant={filter === 'at-risk' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => handleFilterClick('at-risk')}
          >
            <AlertCircle className="h-4 w-4 mr-1" /> At Risk
          </Button>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-1" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={form.handleSubmit(handleAddNewGoal)}>
              <DialogHeader>
                <DialogTitle>Add New Strategic Goal</DialogTitle>
                <DialogDescription>
                  Create a new strategic objective for your organization.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">Goal Title</label>
                  <input
                    {...form.register('title', { required: true })}
                    id="title"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    placeholder="e.g., Increase Market Share by 10%"
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">Title is required</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="owner" className="text-sm font-medium">Owner</label>
                    <input
                      {...form.register('owner')}
                      id="owner"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Goal owner"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="pillar" className="text-sm font-medium">Strategic Pillar</label>
                    <input
                      {...form.register('pillar')}
                      id="pillar"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="e.g., Innovation"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="startDate" className="text-sm font-medium">Start Date</label>
                    <input
                      {...form.register('startDate')}
                      id="startDate"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="targetDate" className="text-sm font-medium">Target Date</label>
                    <input
                      {...form.register('targetDate')}
                      id="targetDate"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="MM/DD/YYYY"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Textarea
                    {...form.register('description')}
                    id="description"
                    placeholder="Add details about this strategic goal"
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Goal</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => (
            <Card className="banking-card" key={goal.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center">
                    <span className={`h-2 w-2 rounded-full mr-2 ${
                      goal.status === 'completed' ? 'bg-green-500' : 
                      goal.status === 'at-risk' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    {goal.title}
                  </CardTitle>
                  {getStatusBadge(goal.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Start Date</span>
                      <p className="text-sm font-medium">{goal.startDate}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Target Date</span>
                      <p className="text-sm font-medium">{goal.targetDate}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Owner</span>
                      <p className="text-sm font-medium">{goal.owner}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs text-muted-foreground">Strategic Pillar</span>
                      <p className="text-sm font-medium">{goal.pillar}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Results</h4>
                    <ul className="space-y-2">
                      {goal.keyResults.map(result => (
                        <li className="flex items-start space-x-2" key={result.id}>
                          {getStatusIcon(result.status)}
                          <span className="text-sm">{result.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => handleViewDetails(goal)}>
                          View Details <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <span className={`h-3 w-3 rounded-full ${
                              goal.status === 'completed' ? 'bg-green-500' : 
                              goal.status === 'at-risk' ? 'bg-yellow-500' : 'bg-blue-500'
                            }`}></span>
                            {goal.title}
                          </DialogTitle>
                          <DialogDescription>
                            {getStatusBadge(goal.status)}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-6">
                          <div className="mb-6">
                            <h4 className="text-sm font-medium mb-2">Progress</h4>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Current Completion</span>
                              <span className="font-medium">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Timeline</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Start Date:</span>
                                  <span className="text-sm">{goal.startDate}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Target Date:</span>
                                  <span className="text-sm">{goal.targetDate}</span>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium mb-2">Ownership</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Owner:</span>
                                  <span className="text-sm">{goal.owner}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-muted-foreground">Pillar:</span>
                                  <span className="text-sm">{goal.pillar}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Results</h4>
                            <div className="space-y-3 border rounded-md p-3">
                              {goal.keyResults.map((result) => (
                                <div key={result.id} className="flex items-start space-x-2">
                                  {getStatusIcon(result.status)}
                                  <div>
                                    <span className="text-sm">{result.text}</span>
                                    <div className="mt-1 text-xs text-muted-foreground">
                                      Status: {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                There are no goals that match your current filter.
              </p>
              <Button onClick={() => setFilter('all')}>View All Goals</Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      {showLoadMore && goals.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" size="sm" onClick={handleLoadMore}>
            <ArrowUpRight className="h-4 w-4 mr-1" /> Load More Goals
          </Button>
        </div>
      )}
    </PageLayout>
  );
};

export default Goals;
