
import React, { useState } from 'react';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Target } from 'lucide-react';
import GoalFormDialog from './GoalFormDialog';
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

const StrategicGoalsManager = () => {
  const { goals, isLoading, createGoal, updateGoal, deleteGoal, isDeleting } = useStrategicGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);

  const handleCreateGoal = (data: any) => {
    createGoal({
      ...data,
      user_id: 'current-user-id', // This should come from auth context
    });
    setIsDialogOpen(false);
  };

  const handleUpdateGoal = (data: any) => {
    if (editingGoal) {
      updateGoal({
        id: editingGoal.id,
        updates: data,
      });
      setEditingGoal(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteGoal = () => {
    if (deletingGoalId) {
      deleteGoal(deletingGoalId);
      setDeletingGoalId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Strategic Goals</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{goal.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingGoal(goal);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingGoalId(goal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge className={getStatusColor(goal.status)}>
                {goal.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {goal.description && (
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {(goal.target_value || goal.current_value) && (
                  <div className="flex justify-between text-sm">
                    <span>Current / Target</span>
                    <span>{goal.current_value || 0} / {goal.target_value || 0}</span>
                  </div>
                )}

                {goal.due_date && (
                  <div className="text-sm text-muted-foreground">
                    Due: {new Date(goal.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <GoalFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingGoal(null);
          }
        }}
        goal={editingGoal}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
      />

      <AlertDialog open={!!deletingGoalId} onOpenChange={() => setDeletingGoalId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Strategic Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this strategic goal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGoal}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StrategicGoalsManager;
