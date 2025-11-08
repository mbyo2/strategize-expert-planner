
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { strategicGoalCreateSchema } from '@/services/validation/schemas';
import { toast } from 'sonner';

// Use centralized schema with enhanced validation
const goalSchema = strategicGoalCreateSchema.extend({
  // Override date fields to accept string format from form
  start_date: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid start date format' }
  ),
  due_date: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid due date format' }
  ),
}).refine(
  (data) => {
    if (data.start_date && data.due_date) {
      return new Date(data.start_date) <= new Date(data.due_date);
    }
    return true;
  },
  {
    message: 'Due date must be after start date',
    path: ['due_date'],
  }
);

type GoalFormValues = z.infer<typeof goalSchema>;

interface GoalFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: any;
  onSubmit: (data: GoalFormValues) => void;
}

const GoalFormDialog: React.FC<GoalFormDialogProps> = ({
  open,
  onOpenChange,
  goal,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: goal?.name || '',
      description: goal?.description || '',
      status: goal?.status || 'planned',
      progress: goal?.progress || 0,
      target_value: goal?.target_value || undefined,
      current_value: goal?.current_value || undefined,
      start_date: goal?.start_date ? new Date(goal.start_date).toISOString().split('T')[0] : '',
      due_date: goal?.due_date ? new Date(goal.due_date).toISOString().split('T')[0] : '',
      priority: goal?.priority || 'medium',
      category: goal?.category || 'general',
      risk_level: goal?.risk_level || 'low',
    },
  });

  React.useEffect(() => {
    if (goal) {
      form.reset({
        name: goal.name || '',
        description: goal.description || '',
        status: goal.status || 'planned',
        progress: goal.progress || 0,
        target_value: goal.target_value || undefined,
        current_value: goal.current_value || undefined,
        start_date: goal.start_date ? new Date(goal.start_date).toISOString().split('T')[0] : '',
        due_date: goal.due_date ? new Date(goal.due_date).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        status: 'planned',
        progress: 0,
        target_value: undefined,
        current_value: undefined,
        start_date: '',
        due_date: '',
      });
    }
  }, [goal, form]);

  const handleSubmit = async (data: GoalFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Transform dates to ISO format if provided
      const transformedData = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
        due_date: data.due_date ? new Date(data.due_date).toISOString() : undefined,
      };
      
      await onSubmit(transformedData as any);
      
      toast.success(goal ? 'Goal Updated' : 'Goal Created', {
        description: goal 
          ? 'Your strategic goal has been updated successfully'
          : 'Your strategic goal has been created successfully',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFormError(errorMessage);
      
      toast.error('Failed to Save Goal', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{goal ? 'Edit Strategic Goal' : 'Create Strategic Goal'}</DialogTitle>
          <DialogDescription>
            {goal 
              ? 'Update the details of your strategic goal.'
              : 'Add a new strategic goal to track your progress.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goal Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Increase Market Share" 
                      {...field}
                      maxLength={255}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/255 characters
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
                      placeholder="Describe your strategic goal..."
                      className="min-h-[100px]"
                      {...field}
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
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
                    <FormLabel>Progress ({field.value}%)</FormLabel>
                    <FormControl>
                      <div className="px-3">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
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
                        placeholder="e.g., 65"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                      <Input type="date" {...field} />
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
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {goal ? 'Update Goal' : 'Create Goal'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalFormDialog;
