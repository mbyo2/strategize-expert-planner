
import React, { useState } from 'react';
import { Target, Plus, Edit2, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useRealTimeStrategicGoals } from '@/hooks/useRealTimeStrategicGoals';
import { createStrategicGoal, updateStrategicGoal, deleteStrategicGoal } from '@/services/strategicGoalsService';
import { useAuth } from '@/hooks/useAuthCompat';
import { toast } from 'sonner';
import GoalFormDialog from './GoalFormDialog';

const StrategicGoals: React.FC = () => {
  const { goals, loading, error } = useRealTimeStrategicGoals();
  const { user } = useAuth();
  const [editingGoal, setEditingGoal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-gray-500';
      case 'active': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'planned': return 'Planned';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'paused': return 'Paused';
      default: return 'Unknown';
    }
  };

  const handleCreateGoal = async (goalData: any) => {
    if (!user) return;
    
    try {
      await createStrategicGoal({
        ...goalData,
        user_id: user.id
      });
      toast.success('Strategic goal created successfully');
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const handleUpdateGoal = async (goalData: any) => {
    if (!editingGoal) return;
    
    try {
      await updateStrategicGoal(editingGoal.id, goalData);
      toast.success('Strategic goal updated successfully');
      setEditingGoal(null);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteStrategicGoal(goalId);
      toast.success('Strategic goal deleted successfully');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  const openEditDialog = (goal: any) => {
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const openCreateDialog = () => {
    setEditingGoal(null);
    setIsFormOpen(true);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Goals</h3>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Strategic Goals</h2>
          <p className="text-muted-foreground">Track and manage your strategic objectives</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Strategic Goals Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first strategic goal to start tracking your progress
          </p>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {goals.map(goal => (
            <Card key={goal.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {goal.name}
                    </CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(goal.status)}>
                      {getStatusText(goal.status)}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => openEditDialog(goal)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                </div>

                {goal.target_value && goal.current_value && (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Current: {goal.current_value}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target: {goal.target_value}</span>
                    </div>
                  </div>
                )}

                {(goal.start_date || goal.due_date) && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {goal.start_date && (
                      <span>Started: {new Date(goal.start_date).toLocaleDateString()}</span>
                    )}
                    {goal.start_date && goal.due_date && <span>•</span>}
                    {goal.due_date && (
                      <span>Due: {new Date(goal.due_date).toLocaleDateString()}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        goal={editingGoal}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
      />
    </div>
  );
};

export default StrategicGoals;
