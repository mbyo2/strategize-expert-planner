
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const goalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['planned', 'active', 'completed', 'paused']),
  progress: z.number().min(0).max(100).default(0),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  start_date: z.string().optional(),
  due_date: z.string().optional(),
});

const metricSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  value: z.number().min(0, 'Value must be positive'),
  category: z.string().min(1, 'Category is required'),
  source: z.string().optional(),
  previous_value: z.number().optional(),
});

const initiativeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'completed', 'paused']),
  progress: z.number().min(0).max(100).default(0),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type EntityType = 'goal' | 'metric' | 'initiative';

interface EntityCreateFormProps {
  entityType: EntityType;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const EntityCreateForm: React.FC<EntityCreateFormProps> = ({
  entityType,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const getSchema = () => {
    switch (entityType) {
      case 'goal': return goalSchema;
      case 'metric': return metricSchema;
      case 'initiative': return initiativeSchema;
      default: return goalSchema;
    }
  };

  const form = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: getDefaultValues()
  });

  function getDefaultValues() {
    switch (entityType) {
      case 'goal':
        return {
          name: '',
          description: '',
          status: 'planned' as const,
          progress: 0,
          target_value: undefined,
          current_value: undefined,
          start_date: '',
          due_date: '',
        };
      case 'metric':
        return {
          name: '',
          value: 0,
          category: '',
          source: '',
          previous_value: undefined,
        };
      case 'initiative':
        return {
          name: '',
          description: '',
          status: 'planning' as const,
          progress: 0,
          start_date: '',
          end_date: '',
        };
      default:
        return {};
    }
  }

  const getTitle = () => {
    switch (entityType) {
      case 'goal': return 'Create Strategic Goal';
      case 'metric': return 'Create Industry Metric';
      case 'initiative': return 'Create Planning Initiative';
      default: return 'Create Entity';
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{getTitle()}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {(entityType === 'goal' || entityType === 'initiative') && (
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {entityType === 'goal' && (
              <>
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
                            placeholder="0" 
                            {...field} 
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {entityType === 'metric' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previous_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={e => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
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
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter category..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter source..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {entityType === 'initiative' && (
              <>
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
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="paused">Paused</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
              </>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EntityCreateForm;
