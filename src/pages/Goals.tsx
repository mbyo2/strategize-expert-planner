
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, User, Loader2, Trash2, Edit } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import GoalFormDialog from '@/components/GoalFormDialog';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const Goals = () => {
  const { goals, isLoading, createGoal, updateGoal, deleteGoal, isCreating, isUpdating, isDeleting } = useStrategicGoals();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredGoals = statusFilter 
    ? goals.filter(goal => goal.status === statusFilter)
    : goals;

  const activeGoals = goals.filter(g => g.status === 'active' || g.status === 'planned').length;
  const atRiskGoals = goals.filter(g => g.risk_level === 'high').length;
  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length) 
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'on-track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'planned':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'at-risk':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleSubmit = (data: any) => {
    if (editingGoal) {
      updateGoal({ id: editingGoal.id, updates: data });
    } else {
      createGoal(data);
    }
    setEditingGoal(null);
    setIsFormOpen(false);
  };

  const handleEdit = (goal: any) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setDeleteConfirmId(null);
  };

  if (isLoading) {
    return (
      <PageLayout 
        title="Strategic Goals"
        subtitle="Loading goals..."
        icon={<Target className="h-6 w-6" />}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="Strategic Goals"
      subtitle="Track and manage your organization's strategic objectives"
      icon={<Target className="h-6 w-6" />}
    >
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={statusFilter === null ? "default" : "outline"} 
              size="sm"
              onClick={() => setStatusFilter(null)}
            >
              All Goals
            </Button>
            <Button 
              variant={statusFilter === 'active' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter('active')}
            >
              Active
            </Button>
            <Button 
              variant={statusFilter === 'planned' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter('planned')}
            >
              Planned
            </Button>
            <Button 
              variant={statusFilter === 'completed' ? "default" : "ghost"} 
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
          <Button 
            className="flex items-center gap-2"
            onClick={() => {
              setEditingGoal(null);
              setIsFormOpen(true);
            }}
            disabled={isCreating}
          >
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>

        {/* Goals Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">{activeGoals} active this quarter</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress}%</div>
              <p className="text-xs text-muted-foreground">Across all goals</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Goals at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${atRiskGoals > 0 ? 'text-red-600' : ''}`}>
                {atRiskGoals}
              </div>
              <p className="text-xs text-muted-foreground">
                {atRiskGoals > 0 ? 'Needs attention' : 'All goals on track'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {filteredGoals.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No goals found</h3>
                <p className="text-muted-foreground mb-4">
                  {statusFilter 
                    ? `No ${statusFilter} goals. Try a different filter or create a new goal.`
                    : 'Get started by creating your first strategic goal.'}
                </p>
                <Button onClick={() => setIsFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{goal.name}</CardTitle>
                      <CardDescription>{goal.description || 'No description'}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(goal.status)}>
                        {goal.status.replace('-', ' ')}
                      </Badge>
                      {goal.priority && (
                        <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                          {goal.priority} priority
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                  </div>

                  {/* Goal Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {goal.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Due {new Date(goal.due_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {goal.category && (
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        <span>{goal.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(goal)}
                      disabled={isUpdating}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit({ ...goal, progress: Math.min(100, (goal.progress || 0) + 10) })}
                    >
                      Update Progress
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteConfirmId(goal.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        goal={editingGoal}
        onSubmit={handleSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageLayout>
  );
};

export default Goals;
