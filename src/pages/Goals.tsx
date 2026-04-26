
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, Calendar, Loader2, Trash2, Edit, Link2, Gavel, Zap } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import GoalFormDialog from '@/components/GoalFormDialog';
import GoalDetailDialog from '@/components/goals/GoalDetailDialog';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { useGoalIntegrationCounts } from '@/hooks/useGoalIntegrationCounts';
import { useSearchParams } from 'react-router-dom';
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
  const [detailGoal, setDetailGoal] = useState<any>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const goalIds = useMemo(() => goals.map((g) => g.id), [goals]);
  const { data: integrationMap = {} } = useGoalIntegrationCounts(goalIds);

  // Deep-link: /goals?goal=<id>
  useEffect(() => {
    const target = searchParams.get('goal');
    if (target && goals.length) {
      const found = goals.find((g) => g.id === target);
      if (found) setDetailGoal(found);
    }
  }, [searchParams, goals]);

  const filteredGoals = statusFilter
    ? goals.filter((goal) => goal.status === statusFilter)
    : goals;

  const activeGoals = goals.filter((g) => g.status === 'active' || g.status === 'planned').length;
  const atRiskGoals = goals.filter((g) => g.risk_level === 'high').length;
  const avgProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length)
    : 0;
  const liveBindingsTotal = Object.values(integrationMap).reduce((s, v) => s + v.bindings, 0);

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
      case 'active':
      case 'on-track':
      case 'completed':
        return 'default';
      case 'at-risk':
        return 'destructive';
      default:
        return 'secondary';
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

  const handleEdit = (e: React.MouseEvent, goal: any) => {
    e.stopPropagation();
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setDeleteConfirmId(null);
  };

  const closeDetail = () => {
    setDetailGoal(null);
    if (searchParams.get('goal')) {
      searchParams.delete('goal');
      setSearchParams(searchParams);
    }
  };

  if (isLoading) {
    return (
      <PageLayout
        title="Strategic Goals"
        subtitle="Loading goals..."
        icon={<Target className="h-5 w-5" />}
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
      subtitle="Live operational data, accountable decisions, signed commitments — all tied to each goal."
      icon={<Target className="h-5 w-5" />}
      actions={
        <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} disabled={isCreating}>
          <Plus className="h-4 w-4 mr-1" /> New Goal
        </Button>
      }
    >
      <SEO title="Strategic Goals · Strategic" description="Goals tied to live ERP data, accountable decisions, and signed strategic commitments." />
      <div className="space-y-6">
        {/* KPI bar */}
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Total goals</div>
              <div className="text-2xl font-bold">{goals.length}</div>
              <p className="text-xs text-muted-foreground">{activeGoals} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Avg progress</div>
              <div className="text-2xl font-bold">{avgProgress}%</div>
              <Progress value={avgProgress} className="h-1 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Zap className="w-3 h-3" /> Live ERP bindings
              </div>
              <div className="text-2xl font-bold">{liveBindingsTotal}</div>
              <p className="text-xs text-muted-foreground">Across all goals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">At risk</div>
              <div className={`text-2xl font-bold ${atRiskGoals > 0 ? 'text-destructive' : ''}`}>{atRiskGoals}</div>
              <p className="text-xs text-muted-foreground">
                {atRiskGoals > 0 ? 'Needs attention' : 'All on track'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: null, label: 'All' },
            { key: 'active', label: 'Active' },
            { key: 'planned', label: 'Planned' },
            { key: 'completed', label: 'Completed' },
          ].map((f) => (
            <Button
              key={f.label}
              variant={statusFilter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Goals list */}
        <div className="space-y-3">
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
                  <Plus className="h-4 w-4 mr-2" /> Create Goal
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredGoals.map((goal) => {
              const integ = integrationMap[goal.id] ?? {
                bindings: 0,
                syncedBindings: 0,
                decisions: 0,
                finalizedDecisions: 0,
                lastSyncedValue: null,
                lastSyncedAt: null,
              };
              return (
                <Card
                  key={goal.id}
                  className="hover:shadow-md hover:border-primary/40 transition-all cursor-pointer"
                  onClick={() => setDetailGoal(goal)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <CardTitle className="text-base truncate">{goal.name}</CardTitle>
                        {goal.description && (
                          <CardDescription className="line-clamp-2">{goal.description}</CardDescription>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <Badge variant={getStatusVariant(goal.status)} className="capitalize">
                          {goal.status.replace('-', ' ')}
                        </Badge>
                        {integ.bindings > 0 && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1 text-primary" />
                            Live
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-0">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.progress || 0}%</span>
                      </div>
                      <Progress value={goal.progress || 0} className="h-2" />
                      {integ.lastSyncedValue != null && (
                        <p className="text-xs text-muted-foreground">
                          Live value: <strong className="text-foreground">{integ.lastSyncedValue}</strong>
                          {goal.target_value != null && <> / {goal.target_value}</>}
                          {' · synced '}
                          {new Date(integ.lastSyncedAt!).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {goal.due_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(goal.due_date).toLocaleDateString()}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Link2 className="h-3 w-3" /> {integ.bindings} binding{integ.bindings !== 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center gap-1">
                        <Gavel className="h-3 w-3" /> {integ.decisions} decision{integ.decisions !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div className="flex gap-1 pt-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm" onClick={(e) => handleEdit(e, goal)} disabled={isUpdating}>
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteConfirmId(goal.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-3 w-3 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <GoalFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        goal={editingGoal}
        onSubmit={handleSubmit}
      />

      <GoalDetailDialog
        open={!!detailGoal}
        onOpenChange={(o) => { if (!o) closeDetail(); }}
        goal={detailGoal}
      />

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
