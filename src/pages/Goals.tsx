import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { withAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import GoalProgressDashboard from '@/components/GoalTracking/GoalProgressDashboard';
import { useAuth } from '@/hooks/useAuth';
import {
  fetchStrategicGoals,
  createStrategicGoal,
  updateStrategicGoal,
  deleteStrategicGoal,
  StrategicGoal
} from '@/services/strategicGoalsService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the form schema using Zod
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Goal name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  progress: z.number().min(0).max(100).default(0),
  status: z.enum(['planning', 'in-progress', 'completed', 'cancelled']).default('planning'),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
});

const Goals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<StrategicGoal | null>(null);

  // Define the form using useForm hook
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      progress: 0,
      status: 'in-progress',
      start_date: '',
      due_date: '',
      target_value: 0,
      current_value: 0,
    },
  });

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    setIsLoading(true);
    try {
      const fetchedGoals = await fetchStrategicGoals();
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error loading strategic goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGoal = async (data: z.infer<typeof formSchema>) => {
    if (!user) return;

    try {
      await createStrategicGoal({
        ...data,
        user_id: user.id,
        progress: data.progress || 0,
        status: data.status || 'in-progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // Reload goals after creating
      await loadGoals();
      setCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating strategic goal:', error);
    }
  };

  const handleUpdateGoal = async (data: z.infer<typeof formSchema>) => {
    if (!selectedGoal) return;

    try {
      await updateStrategicGoal(selectedGoal.id, {
        ...data,
        progress: data.progress || 0,
        status: data.status || 'in-progress',
        updated_at: new Date().toISOString(),
      });

      // Reload goals after updating
      await loadGoals();
      setEditDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error updating strategic goal:', error);
    }
  };

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return;

    try {
      await deleteStrategicGoal(selectedGoal.id);

      // Reload goals after deleting
      await loadGoals();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting strategic goal:', error);
    }
  };

  return (
    <PageLayout title="Strategic Goals" subtitle="Track and manage your organization's strategic goals">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Goal Tracking Dashboard</h2>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Goal
          </Button>
        </div>

        <GoalProgressDashboard />

        {/* Create Goal Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Strategic Goal</DialogTitle>
              <DialogDescription>
                Add a new strategic goal to track.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateGoal)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of the goal.
                      </FormDescription>
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
                          placeholder="Enter goal description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the current progress of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the current status of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the start date of the goal.
                      </FormDescription>
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
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the due date of the goal.
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
                          placeholder="Enter target value"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the target value of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter current value"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the current value of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit Goal Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Strategic Goal</DialogTitle>
              <DialogDescription>
                Edit an existing strategic goal.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleUpdateGoal)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter goal name" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the name of the goal.
                      </FormDescription>
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
                          placeholder="Enter goal description"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide a detailed description of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[field.value]}
                          max={100}
                          step={1}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the current progress of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Set the current status of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the start date of the goal.
                      </FormDescription>
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
                        <Input
                          type="date"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the due date of the goal.
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
                          placeholder="Enter target value"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the target value of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="current_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Value</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter current value"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Set the current value of the goal.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Update</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Delete Goal Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Strategic Goal</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this strategic goal? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteGoal}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default withAuth(['admin', 'manager', 'analyst'])(Goals);
