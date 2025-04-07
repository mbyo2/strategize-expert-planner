import React from 'react';
import PageLayout from '@/components/PageLayout';
import { useState, useEffect } from 'react';
import {
  fetchStrategicGoals,
  createStrategicGoal,
  updateStrategicGoal,
  deleteStrategicGoal,
  StrategicGoal
} from '@/services/strategicGoalsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/hooks/useAuth';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from 'sonner';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Goals = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned',
    progress: 0,
    start_date: undefined,
    due_date: undefined,
    target_value: 0,
    current_value: 0,
  });

  useEffect(() => {
    const loadGoals = async () => {
      try {
        const goalsData = await fetchStrategicGoals();
        setGoals(goalsData);
      } catch (error) {
        console.error('Error loading goals:', error);
      }
    };

    loadGoals();
  }, []);

  const formatDate = (date: Date | undefined): string => {
    return date ? format(date, 'yyyy-MM-dd') : '';
  };

  const handleSubmit = async (formData: FormData) => {
    // Filter out the created_at property and make sure to include only valid properties
    const newGoal: Omit<StrategicGoal, "id" | "updated_at" | "created_at"> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status: (formData.get('status') as StrategicGoal['status']) || 'planned',
      progress: parseInt(formData.get('progress') as string) || 0,
      user_id: user?.id || '',
      start_date: formData.get('start_date') as string,
      due_date: formData.get('due_date') as string,
      target_value: parseFloat(formData.get('target_value') as string) || 0,
      current_value: parseFloat(formData.get('current_value') as string) || 0
    };

    try {
      await createStrategicGoal(newGoal);
      toast.success('Goal created successfully');
      const updatedGoals = await fetchStrategicGoals();
      setGoals(updatedGoals);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<StrategicGoal>) => {
    try {
      await updateStrategicGoal(id, updates);
      toast.success('Goal updated successfully');
      const updatedGoals = await fetchStrategicGoals();
      setGoals(updatedGoals);
      setEditingGoalId(null);
    } catch (error) {
      console.error('Failed to update goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStrategicGoal(id);
      toast.success('Goal deleted successfully');
      const updatedGoals = await fetchStrategicGoals();
      setGoals(updatedGoals);
    } catch (error) {
      console.error('Failed to delete goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <PageLayout title="Strategic Goals" subtitle="Track and manage your strategic objectives">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Current Goals</h2>
          <Button onClick={toggleForm}>Add New Goal</Button>
        </div>

        {isFormOpen && (
          <div className="mb-6 p-4 border rounded-md">
            <h3 className="text-xl font-semibold mb-2">Add a New Goal</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                await handleSubmit(formData);
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input type="text" id="name" name="name" required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input type="text" id="description" name="description" />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="progress">Progress</Label>
                  <Slider
                    id="progress"
                    name="progress"
                    defaultValue={[0]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                  />
                  <p className="text-sm text-muted-foreground">Progress: {formData.progress}</p>
                </div>
                <div>
                  <Label htmlFor="start_date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={formatDate(formData.start_date) ? "w-full justify-start text-left font-normal" : "w-full justify-start text-left font-normal text-muted-foreground"}
                      >
                        {formatDate(formData.start_date) ? (
                          formatDate(formData.start_date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={formData.start_date}
                        onSelect={(date) => setFormData({ ...formData, start_date: date })}
                        disabled={(date) =>
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input type="hidden" id="start_date" name="start_date" value={formatDate(formData.start_date)} />
                </div>
                <div>
                  <Label htmlFor="due_date">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={formatDate(formData.due_date) ? "w-full justify-start text-left font-normal" : "w-full justify-start text-left font-normal text-muted-foreground"}
                      >
                        {formatDate(formData.due_date) ? (
                          formatDate(formData.due_date)
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center" side="bottom">
                      <Calendar
                        mode="single"
                        selected={formData.due_date}
                        onSelect={(date) => setFormData({ ...formData, due_date: date })}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input type="hidden" id="due_date" name="due_date" value={formatDate(formData.due_date)} />
                </div>
                <div>
                  <Label htmlFor="target_value">Target Value</Label>
                  <Input type="number" id="target_value" name="target_value" />
                </div>
                <div>
                  <Label htmlFor="current_value">Current Value</Label>
                  <Input type="number" id="current_value" name="current_value" />
                </div>
              </div>

              <Button type="submit" className="mt-4">Create Goal</Button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableCaption>A list of your strategic goals.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Target Value</TableHead>
                <TableHead>Current Value</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.map((goal) => (
                <TableRow key={goal.id}>
                  <TableCell className="font-medium">{goal.name}</TableCell>
                  <TableCell>{goal.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{goal.status}</Badge>
                  </TableCell>
                  <TableCell>{goal.progress}%</TableCell>
                  <TableCell>{goal.start_date}</TableCell>
                  <TableCell>{goal.due_date}</TableCell>
                  <TableCell>{goal.target_value}</TableCell>
                  <TableCell>{goal.current_value}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingGoalId(goal.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(goal.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={8}>
                  {goals.length} goal(s) in total
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        {editingGoalId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Edit Goal</h3>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const formData = new FormData(form);
                  const updates: Partial<StrategicGoal> = {
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    status: formData.get('status') as StrategicGoal['status'],
                    progress: parseInt(formData.get('progress') as string),
                    start_date: formData.get('start_date') as string,
                    due_date: formData.get('due_date') as string,
                    target_value: parseFloat(formData.get('target_value') as string),
                    current_value: parseFloat(formData.get('current_value') as string)
                  };
                  await handleUpdate(editingGoalId, updates);
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input type="text" id="name" name="name" defaultValue={goals.find(g => g.id === editingGoalId)?.name} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input type="text" id="description" name="description" defaultValue={goals.find(g => g.id === editingGoalId)?.description} />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select name="status" defaultValue={goals.find(g => g.id === editingGoalId)?.status}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="progress">Progress</Label>
                    <Slider
                      id="progress"
                      name="progress"
                      defaultValue={[goals.find(g => g.id === editingGoalId)?.progress || 0]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setFormData({ ...formData, progress: value[0] })}
                    />
                    <p className="text-sm text-muted-foreground">Progress: {formData.progress}</p>
                  </div>
                  <div>
                    <Label htmlFor="start_date">Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={formatDate(formData.start_date) ? "w-full justify-start text-left font-normal" : "w-full justify-start text-left font-normal text-muted-foreground"}
                        >
                          {formatDate(formData.start_date) ? (
                            formatDate(formData.start_date)
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={formData.start_date}
                          onSelect={(date) => setFormData({ ...formData, start_date: date })}
                          disabled={(date) =>
                            date > new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input type="hidden" id="start_date" name="start_date" value={formatDate(formData.start_date)} />
                  </div>
                  <div>
                    <Label htmlFor="due_date">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={formatDate(formData.due_date) ? "w-full justify-start text-left font-normal" : "w-full justify-start text-left font-normal text-muted-foreground"}
                        >
                          {formatDate(formData.due_date) ? (
                            formatDate(formData.due_date)
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center" side="bottom">
                        <Calendar
                          mode="single"
                          selected={formData.due_date}
                          onSelect={(date) => setFormData({ ...formData, due_date: date })}
                          disabled={(date) =>
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Input type="hidden" id="due_date" name="due_date" value={formatDate(formData.due_date)} />
                  </div>
                  <div>
                    <Label htmlFor="target_value">Target Value</Label>
                    <Input type="number" id="target_value" name="target_value" defaultValue={goals.find(g => g.id === editingGoalId)?.target_value} />
                  </div>
                  <div>
                    <Label htmlFor="current_value">Current Value</Label>
                    <Input type="number" id="current_value" name="current_value" defaultValue={goals.find(g => g.id === editingGoalId)?.current_value} />
                  </div>
                </div>

                <Button type="submit" className="mt-4">Update Goal</Button>
                <Button type="button" variant="ghost" className="mt-4 ml-2" onClick={() => setEditingGoalId(null)}>Cancel</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default Goals;
