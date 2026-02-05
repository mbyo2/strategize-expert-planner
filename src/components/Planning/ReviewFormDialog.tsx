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
import { Loader2 } from 'lucide-react';
import { StrategyReview, CreateReviewData } from '@/hooks/useStrategyReviews';

const reviewSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  scheduled_date: z.string().min(1, 'Date is required'),
  duration_minutes: z.number().min(15).max(480),
  status: z.enum(['draft', 'scheduled', 'completed', 'cancelled']),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: StrategyReview;
  onSubmit: (data: CreateReviewData) => void;
  isSubmitting?: boolean;
}

const ReviewFormDialog: React.FC<ReviewFormDialogProps> = ({
  open,
  onOpenChange,
  review,
  onSubmit,
  isSubmitting = false,
}) => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      title: review?.title || '',
      description: review?.description || '',
      scheduled_date: review?.scheduled_date ? new Date(review.scheduled_date).toISOString().split('T')[0] : '',
      duration_minutes: review?.duration_minutes || 60,
      status: review?.status || 'draft',
    },
  });

  React.useEffect(() => {
    if (review) {
      form.reset({
        title: review.title || '',
        description: review.description || '',
        scheduled_date: review.scheduled_date ? new Date(review.scheduled_date).toISOString().split('T')[0] : '',
        duration_minutes: review.duration_minutes || 60,
        status: review.status || 'draft',
      });
    } else {
      form.reset({
        title: '',
        description: '',
        scheduled_date: '',
        duration_minutes: 60,
        status: 'draft',
      });
    }
  }, [review, form]);

  const handleSubmit = (data: ReviewFormValues) => {
    const reviewData: CreateReviewData = {
      title: data.title,
      description: data.description,
      scheduled_date: data.scheduled_date,
      duration_minutes: data.duration_minutes,
      status: data.status,
    };
    onSubmit(reviewData);
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{review ? 'Edit Review' : 'Schedule Review'}</DialogTitle>
          <DialogDescription>
            {review 
              ? 'Update the details of this strategy review.'
              : 'Schedule a new strategy review session.'
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Q2 Strategic Review" {...field} />
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
                      placeholder="Brief description of the review..."
                      className="min-h-[60px]"
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
                name="scheduled_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={15}
                        max={480}
                        step={15}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {review ? 'Update Review' : 'Schedule Review'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewFormDialog;
