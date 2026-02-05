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
import { Loader2 } from 'lucide-react';
import { PlanningInitiative } from '@/services/planningInitiativesService';

const initiativeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().optional(),
  status: z.enum(['planning', 'in-progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type InitiativeFormValues = z.infer<typeof initiativeSchema>;

interface InitiativeFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initiative?: PlanningInitiative;
  onSubmit: (data: Partial<PlanningInitiative>) => void;
  isSubmitting?: boolean;
}

const InitiativeFormDialog: React.FC<InitiativeFormDialogProps> = ({
  open,
  onOpenChange,
  initiative,
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      name: initiative?.name || '',
      description: initiative?.description || '',
      status: initiative?.status || 'planning',
      progress: initiative?.progress || 0,
      start_date: initiative?.start_date ? new Date(initiative.start_date).toISOString().split('T')[0] : '',
      end_date: initiative?.end_date ? new Date(initiative.end_date).toISOString().split('T')[0] : '',
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

  const handleSubmit = (data: InitiativeFormValues) => {
    const transformedData: Partial<PlanningInitiative> = {
      name: data.name,
      description: data.description,
      status: data.status,
      progress: data.progress,
      start_date: data.start_date || undefined,
      end_date: data.end_date || undefined,
    };
    onSubmit(transformedData);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initiative ? 'Edit Initiative' : 'Create Initiative'}</DialogTitle>
          <DialogDescription>
            {initiative 
              ? 'Update the details of your planning initiative.'
              : 'Add a new planning initiative to track your strategic projects.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initiative Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Digital Transformation" {...field} />
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
                      placeholder="Describe the initiative..."
                      className="min-h-[80px]"
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
                      <div className="px-3 pt-2">
                        <Slider
                          min={0}
                          max={100}
                          step={5}
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
                {initiative ? 'Update Initiative' : 'Create Initiative'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeFormDialog;
