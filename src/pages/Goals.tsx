
import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Target, AlertCircle, CheckCircle2, Target as TargetIcon, ArrowUp, ArrowDown, Minus, Edit, Trash2, Plus } from 'lucide-react';
import { useRealTimeStrategicGoals } from '@/hooks/useRealTimeStrategicGoals';
import { createStrategicGoal, updateStrategicGoal, deleteStrategicGoal, StrategicGoal } from '@/services/strategicGoalsService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Form schema for adding/editing a goal
const goalFormSchema = z.object({
  name: z.string().min(3, "Goal name must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(['planned', 'in-progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  current_value: z.number().optional(),
  target_value: z.number().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

const GoalStatusBadge = ({ status }: { status: string }) => {
  let variant = "default";
  
  switch (status.toLowerCase()) {
    case 'completed':
      variant = "success";
      break;
    case 'in-progress':
      variant = "default";
      break;
    case 'planned':
      variant = "secondary";
      break;
    case 'cancelled':
      variant = "destructive";
      break;
  }
  
  return <Badge variant={variant as any}>{status}</Badge>;
};

const GoalProgressIndicator = ({ goal }: { goal: StrategicGoal }) => {
  let color = "bg-primary";
  
  if (goal.status === 'completed') {
    color = "bg-green-500";
  } else if (goal.status === 'cancelled') {
    color = "bg-red-500";
  }
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span>{goal.progress}%</span>
        {goal.current_value !== null && goal.target_value !== null && (
          <span>{goal.current_value} / {goal.target_value}</span>
        )}
      </div>
      <Progress value={goal.progress} className={`h-2`} indicatorClassName={color} />
    </div>
  );
};

const GoalTrendIndicator = ({ current, previous }: { current?: number; previous?: number }) => {
  if (current === undefined || previous === undefined) return null;
  
  if (current > previous) {
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  } else if (current < previous) {
    return <ArrowDown className="h-4 w-4 text-red-500" />;
  } else {
    return <Minus className="h-4 w-4 text-yellow-500" />;
  }
};

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
    <Skeleton className="h-96 w-full" />
  </div>
);

const Goals = () => {
  const { user } = useAuth();
  const { goals, loading, error } = useRealTimeStrategicGoals();
  const [showAddGoalDialog, setShowAddGoalDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planned',
      progress: 0,
      start_date: '',
      due_date: '',
      current_value: undefined,
      target_value: undefined,
    }
  });
  
  // Computed stats
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'in-progress').length;
  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  
  // Handle edit goal
  const handleEditGoal = (goal: StrategicGoal) => {
    setEditingGoal(goal);
    
    form.reset({
      name: goal.name,
      description: goal.description || '',
      status: goal.status as any,
      progress: goal.progress,
      start_date: goal.start_date ? new Date(goal.start_date).toISOString().split('T')[0] : '',
      due_date: goal.due_date ? new Date(goal.due_date).toISOString().split('T')[0] : '',
      current_value: goal.current_value || undefined,
      target_value: goal.target_value || undefined,
    });
    
    setShowAddGoalDialog(true);
  };
  
  // Handle create/update goal
  const onSubmit = async (data: GoalFormValues) => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    
    try {
      if (editingGoal) {
        // Update existing goal
        await updateStrategicGoal(editingGoal.id, {
          ...data,
          user_id: user.id,
        });
        toast.success('Goal updated successfully');
      } else {
        // Create new goal
        await createStrategicGoal({
          name: data.name,
          description: data.description,
          progress: data.progress || 0,
          status: data.status || 'planned',
          start_date: data.start_date,
          due_date: data.due_date,
          user_id: user.id,
          target_value: data.target_value,
          current_value: data.current_value,
        });
        toast.success('Goal created successfully');
      }
      
      // Reset form and close dialog
      form.reset();
      setEditingGoal(null);
      setShowAddGoalDialog(false);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast.error('Failed to save goal');
    }
  };
  
  // Handle delete goal
  const handleDeleteGoal = async (id: string) => {
    try {
      await deleteStrategicGoal(id);
      toast.success('Goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };
  
  return (
    <PageLayout
      title="Strategic Goals"
      subtitle="Track and manage your organization's strategic objectives"
      icon={<Target className="h-6 w-6" />}
    >
      {loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="flex items-center justify-center p-8 text-red-500">
          <AlertCircle className="h-5 w-5 mr-2" />
          Failed to load strategic goals. Please try again.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                    <h3 className="text-3xl font-bold">{totalGoals}</h3>
                  </div>
                  <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <TargetIcon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <h3 className="text-3xl font-bold">{completedGoals}</h3>
                  </div>
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <h3 className="text-3xl font-bold">{inProgressGoals}</h3>
                  </div>
                  <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <h3 className="text-3xl font-bold">{completionRate}%</h3>
                  </div>
                  <div className="h-12 w-12 rounded-full flex items-center justify-center">
                    <Progress value={completionRate} className="h-12 w-12 rounded-full" indicatorClassName="bg-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Goals</h2>
            <Button onClick={() => {
              setEditingGoal(null);
              form.reset({
                name: '',
                description: '',
                status: 'planned',
                progress: 0,
                start_date: '',
                due_date: '',
                current_value: undefined,
                target_value: undefined,
              });
              setShowAddGoalDialog(true);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Goals</TabsTrigger>
              <TabsTrigger value="in-progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <GoalsTable 
                goals={goals} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
              />
            </TabsContent>
            
            <TabsContent value="in-progress">
              <GoalsTable 
                goals={goals.filter(g => g.status === 'in-progress')} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <GoalsTable 
                goals={goals.filter(g => g.status === 'completed')} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
              />
            </TabsContent>
            
            <TabsContent value="planned">
              <GoalsTable 
                goals={goals.filter(g => g.status === 'planned')} 
                onEdit={handleEditGoal} 
                onDelete={handleDeleteGoal}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
      
      {/* Add/Edit Goal Dialog */}
      <Dialog open={showAddGoalDialog} onOpenChange={setShowAddGoalDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingGoal ? 'Edit Strategic Goal' : 'Add Strategic Goal'}</DialogTitle>
            <DialogDescription>
              {editingGoal 
                ? 'Update the details of your strategic goal.' 
                : 'Define a new strategic goal for your organization.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Increase Market Share" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the goal and how it will be measured"
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select goal status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="current_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 25"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Current measurement value (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="target_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 100"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                          onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormDescription>
                        Goal target value (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddGoalDialog(false);
                  setEditingGoal(null);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

interface GoalsTableProps {
  goals: StrategicGoal[];
  onEdit: (goal: StrategicGoal) => void;
  onDelete: (id: string) => void;
}

const GoalsTable: React.FC<GoalsTableProps> = ({ goals, onEdit, onDelete }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Goals Found</h3>
        <p className="text-muted-foreground mb-6">
          No strategic goals matching the selected filter.
        </p>
        <Button>Add Your First Goal</Button>
      </div>
    );
  }
  
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <TableRow key={goal.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{goal.name}</div>
                    {goal.description && (
                      <div className="text-sm text-muted-foreground">{goal.description}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <GoalStatusBadge status={goal.status} />
                </TableCell>
                <TableCell>
                  <GoalProgressIndicator goal={goal} />
                </TableCell>
                <TableCell>
                  {goal.due_date ? format(new Date(goal.due_date), 'MMM d, yyyy') : 'No deadline'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(goal)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(goal.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default Goals;
