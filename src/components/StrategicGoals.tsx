import React, { useState } from 'react';
import { useDatabase } from '@/hooks/useDatabase';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { AnalyticsTrackingService } from '@/services/analyticsTrackingService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Plus, Target, TrendingUp, Calendar, Edit, Trash2, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import DataImportDialog from './DataImportDialog';
import DataExportDialog from './DataExportDialog';

interface StrategicGoal {
  id: string;
  name: string;
  description?: string;
  status: 'planned' | 'active' | 'completed' | 'paused';
  progress: number;
  target_value?: number;
  current_value?: number;
  start_date?: string;
  due_date?: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

const StrategicGoals: React.FC = () => {
  const { session } = useSimpleAuth();
  const { data: goals, loading, error, create, update, remove, search } = useDatabase<StrategicGoal>('strategic_goals');
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StrategicGoal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planned' as const,
    target_value: '',
    start_date: '',
    due_date: ''
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planned',
      target_value: '',
      start_date: '',
      due_date: ''
    });
  };

  const handleCreate = async () => {
    if (!session.user || !formData.name.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    const goalData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      target_value: formData.target_value ? parseFloat(formData.target_value) : null,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null,
      progress: 0,
      current_value: 0,
      user_id: session.user.id
    };

    const result = await create(goalData);
    if (result) {
      setIsCreateDialogOpen(false);
      resetForm();
      AnalyticsTrackingService.trackFeatureUsage('strategic_goals', 'create');
    }
  };

  const handleUpdate = async () => {
    if (!editingGoal || !formData.name.trim()) {
      toast.error('Please fill in required fields');
      return;
    }

    const updateData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      target_value: formData.target_value ? parseFloat(formData.target_value) : null,
      start_date: formData.start_date || null,
      due_date: formData.due_date || null
    };

    const result = await update(editingGoal.id, updateData);
    if (result) {
      setEditingGoal(null);
      resetForm();
      AnalyticsTrackingService.trackFeatureUsage('strategic_goals', 'update');
    }
  };

  const handleDelete = async (goal: StrategicGoal) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      const success = await remove(goal.id);
      if (success) {
        AnalyticsTrackingService.trackFeatureUsage('strategic_goals', 'delete');
      }
    }
  };

  const handleEdit = (goal: StrategicGoal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      status: goal.status,
      target_value: goal.target_value?.toString() || '',
      start_date: goal.start_date ? goal.start_date.split('T')[0] : '',
      due_date: goal.due_date ? goal.due_date.split('T')[0] : ''
    });
  };

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      await search(searchTerm);
      AnalyticsTrackingService.trackFeatureUsage('strategic_goals', 'search');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'active': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'active': return 'default';
      case 'paused': return 'secondary';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-2 bg-muted rounded w-full"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-destructive">Error loading goals: {error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Strategic Goals</h2>
        <div className="flex gap-2">
          <DataImportDialog />
          <DataExportDialog />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Strategic Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Goal Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter goal name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the goal"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planned">Planned</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <Input
                      id="due-date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="target-value">Target Value</Label>
                  <Input
                    id="target-value"
                    type="number"
                    value={formData.target_value}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                    placeholder="Enter target value"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create Goal</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search goals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button variant="outline" onClick={handleSearch}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {goal.name}
                  </CardTitle>
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusBadgeVariant(goal.status)}>
                    {goal.status}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(goal)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(goal)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                  </div>
                  {goal.target_value && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Target</div>
                      <div className="font-semibold">{goal.target_value}</div>
                    </div>
                  )}
                  {goal.current_value !== null && (
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground">Current</div>
                      <div className="font-semibold">{goal.current_value}</div>
                    </div>
                  )}
                </div>

                {(goal.start_date || goal.due_date) && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {goal.start_date && (
                      <span>Started: {new Date(goal.start_date).toLocaleDateString()}</span>
                    )}
                    {goal.due_date && (
                      <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {goals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Strategic Goals</h3>
              <p className="text-muted-foreground mb-4">
                Start by creating your first strategic goal to track your progress.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create First Goal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={(open) => !open && setEditingGoal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Strategic Goal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Goal Name *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter goal name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the goal"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-start-date">Start Date</Label>
                <Input
                  id="edit-start-date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-target-value">Target Value</Label>
              <Input
                id="edit-target-value"
                type="number"
                value={formData.target_value}
                onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                placeholder="Enter target value"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingGoal(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>Update Goal</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StrategicGoals;
