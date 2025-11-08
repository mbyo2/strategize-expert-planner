
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
import { planningInitiativeCreateSchema } from '@/services/validation/schemas';
import { toast } from 'sonner';

// Use centralized schema with enhanced validation
const initiativeSchema = planningInitiativeCreateSchema.extend({
  start_date: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid start date format' }
  ),
  end_date: z.string().optional().refine(
    (date) => !date || !isNaN(Date.parse(date)),
    { message: 'Invalid end date format' }
  ),
}).refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return new Date(data.start_date) <= new Date(data.end_date);
    }
    return true;
  },
  {
    message: 'End date must be after start date',
    path: ['end_date'],
  }
);

type InitiativeFormValues = z.infer<typeof initiativeSchema>;

interface PlanningInitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiative?: any;
  onSubmit: (data: InitiativeFormValues) => void;
}

const PlanningInitiativeDialog: React.FC<PlanningInitiativeDialogProps> = ({
  open,
  onOpenChange,
  initiative,
  onSubmit,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formError, setFormError] = React.useState<string | null>(null);

  const form = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      name: initiative?.name || '',
      description: initiative?.description || '',
      status: initiative?.status || 'planning',
      progress: initiative?.progress || 0,
      start_date: initiative?.start_date ? new Date(initiative.start_date).toISOString().split('T')[0] : '',
      end_date: initiative?.end_date ? new Date(initiative.end_date).toISOString().split('T')[0] : '',
      priority: initiative?.priority || 'medium',
    },
  });

  React.useEffect(() => {
    if (initiative) {
      form.reset({
        name: initiative.name || '',
        description: initiative.description || '',
        status: initiative.status || 'planning',
        progress: initiative.progress || 0,
        start_date: initiative.start_date ? new Date(initiative.start_date).toISOString().split('T')[0] : '',
        end_date: initiative.end_date ? new Date(initiative.end_date).toISOString().split('T')[0] : '',
      });
    } else {
      form.reset({
        name: '',
        description: '',
        status: 'planning',
        progress: 0,
        start_date: '',
        end_date: '',
      });
    }
  }, [initiative, form]);

  const handleSubmit = async (data: InitiativeFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const transformedData = {
        ...data,
        start_date: data.start_date ? new Date(data.start_date).toISOString() : undefined,
        end_date: data.end_date ? new Date(data.end_date).toISOString() : undefined,
      };
      
      await onSubmit(transformedData as any);
      
      toast.success(initiative ? 'Initiative Updated' : 'Initiative Created', {
        description: initiative 
          ? 'Your planning initiative has been updated successfully'
          : 'Your planning initiative has been created successfully',
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setFormError(errorMessage);
      
      toast.error('Failed to Save Initiative', {
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
          <DialogTitle>{initiative ? 'Edit Planning Initiative' : 'Create Planning Initiative'}</DialogTitle>
          <DialogDescription>
            {initiative 
              ? 'Update the details of your planning initiative.'
              : 'Add a new planning initiative to track your progress.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Digital Transformation Initiative" {...field} />
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
                      placeholder="Describe your planning initiative..."
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
                        <SelectItem value="planning">Planning</SelectItem>
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
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {initiative ? 'Update Initiative' : 'Create Initiative'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PlanningInitiativeDialog;
