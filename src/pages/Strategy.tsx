import React, { useMemo, useState } from 'react';
import { format, differenceInCalendarDays, parseISO, isValid } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Plus, Target, TrendingUp, Activity, CalendarDays, Trash2 } from 'lucide-react';
import { useStrategy, useStrategyRollups, STRATEGY_STATUS_COLUMNS, type StrategyPlan } from '@/hooks/useStrategy';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { usePlanningInitiatives } from '@/hooks/usePlanningInitiatives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const statusColor: Record<StrategyPlan['status'], string> = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-primary/15 text-primary',
  on_hold: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  completed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  archived: 'bg-muted text-muted-foreground',
};

const Strategy: React.FC = () => {
  const { plans, progressLogs, isLoading, createPlan, updatePlan, deletePlan, addProgressLog } = useStrategy();
  const { goals } = useStrategicGoals();
  const { initiatives } = usePlanningInitiatives();
  const { planRollup } = useStrategyRollups(plans, goals as any, initiatives as any);

  const [planDialogOpen, setPlanDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StrategyPlan | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const selectedPlan = plans.find((p) => p.id === selectedPlanId) ?? null;

  // KPI tiles
  const kpis = useMemo(() => {
    const active = plans.filter((p) => p.status === 'active').length;
    const completed = plans.filter((p) => p.status === 'completed').length;
    const avgProgress =
      plans.length > 0
        ? Math.round(
            Array.from(planRollup.values()).reduce((a, b) => a + b, 0) / Math.max(plans.length, 1),
          )
        : 0;
    return {
      total: plans.length,
      active,
      completed,
      avgProgress,
      objectives: goals.length,
      initiatives: initiatives.length,
    };
  }, [plans, planRollup, goals.length, initiatives.length]);

  // Timeline rows
  const timelineRows = useMemo(() => {
    const rows = plans
      .map((p) => {
        const start = p.start_date ? parseISO(p.start_date) : null;
        const end = p.end_date ? parseISO(p.end_date) : null;
        return { plan: p, start, end };
      })
      .filter((r) => r.start && r.end && isValid(r.start) && isValid(r.end));
    if (rows.length === 0) return { rows: [], minDate: null as Date | null, totalDays: 0 };
    const minDate = rows.reduce((m, r) => (r.start! < m ? r.start! : m), rows[0].start!);
    const maxDate = rows.reduce((m, r) => (r.end! > m ? r.end! : m), rows[0].end!);
    const totalDays = Math.max(differenceInCalendarDays(maxDate, minDate) + 1, 1);
    return { rows, minDate, totalDays };
  }, [plans]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Strategy Dashboard</h1>
          <p className="text-muted-foreground">
            Plan, organize, and track strategic plans, objectives, and initiatives over time.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingPlan(null);
            setPlanDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> New Plan
        </Button>
      </header>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <KpiTile icon={Target} label="Plans" value={kpis.total} />
        <KpiTile icon={Activity} label="Active" value={kpis.active} accent />
        <KpiTile icon={TrendingUp} label="Avg Progress" value={`${kpis.avgProgress}%`} />
        <KpiTile icon={Target} label="Objectives" value={kpis.objectives} />
        <KpiTile icon={Activity} label="Initiatives" value={kpis.initiatives} />
        <KpiTile icon={CalendarDays} label="Completed" value={kpis.completed} />
      </div>

      <Tabs defaultValue="kanban" className="w-full">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="progress">Progress over time</TabsTrigger>
        </TabsList>

        {/* Kanban */}
        <TabsContent value="kanban" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {STRATEGY_STATUS_COLUMNS.map((col) => {
              const colPlans = plans.filter((p) => p.status === col.key);
              return (
                <div key={col.key} className="rounded-lg border bg-card/40 p-3 min-h-[300px]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-sm uppercase tracking-wide">{col.label}</h3>
                    <Badge variant="secondary">{colPlans.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {colPlans.map((p) => (
                      <PlanCard
                        key={p.id}
                        plan={p}
                        progress={planRollup.get(p.id) ?? 0}
                        objectiveCount={goals.filter((g: any) => g.strategy_plan_id === p.id).length}
                        initiativeCount={initiatives.filter((i: any) => i.strategy_plan_id === p.id).length}
                        onSelect={() => setSelectedPlanId(p.id)}
                        onEdit={() => {
                          setEditingPlan(p);
                          setPlanDialogOpen(true);
                        }}
                        onStatusChange={(status) =>
                          updatePlan.mutate({ id: p.id, updates: { status } })
                        }
                        onDelete={() => deletePlan.mutate(p.id)}
                      />
                    ))}
                    {colPlans.length === 0 && (
                      <p className="text-xs text-muted-foreground italic">No plans</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Timeline */}
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {timelineRows.rows.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Add start and end dates to plans to see them on the timeline.
                </p>
              ) : (
                <div className="space-y-3">
                  {timelineRows.rows.map(({ plan, start, end }) => {
                    const offset = differenceInCalendarDays(start!, timelineRows.minDate!);
                    const span = Math.max(differenceInCalendarDays(end!, start!) + 1, 1);
                    const leftPct = (offset / timelineRows.totalDays) * 100;
                    const widthPct = (span / timelineRows.totalDays) * 100;
                    const progress = planRollup.get(plan.id) ?? 0;
                    return (
                      <div
                        key={plan.id}
                        className="grid grid-cols-[200px_1fr] gap-3 items-center cursor-pointer"
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <div className="truncate text-sm font-medium">{plan.name}</div>
                        <div className="relative h-7 bg-muted rounded">
                          <div
                            className="absolute h-full rounded bg-primary/30 border border-primary/40"
                            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          >
                            <div
                              className="h-full bg-primary rounded-l"
                              style={{ width: `${progress}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-medium text-foreground/80">
                              {format(start!, 'MMM d')} → {format(end!, 'MMM d')} · {progress}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Progress over time */}
        <TabsContent value="progress" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <ProgressChart plans={plans} logs={progressLogs} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Plan detail / check-in panel */}
      {selectedPlan && (
        <PlanDetailDialog
          plan={selectedPlan}
          progress={planRollup.get(selectedPlan.id) ?? 0}
          logs={progressLogs.filter((l) => l.entity_id === selectedPlan.id && l.entity_type === 'plan')}
          onClose={() => setSelectedPlanId(null)}
          onAddCheckIn={(progress, note) =>
            addProgressLog.mutate({
              entity_type: 'plan',
              entity_id: selectedPlan.id,
              progress,
              note,
            })
          }
          isSaving={addProgressLog.isPending}
        />
      )}

      <PlanFormDialog
        open={planDialogOpen}
        onOpenChange={setPlanDialogOpen}
        plan={editingPlan}
        onSubmit={(values) => {
          if (editingPlan) {
            updatePlan.mutate(
              { id: editingPlan.id, updates: values },
              { onSuccess: () => setPlanDialogOpen(false) },
            );
          } else {
            createPlan.mutate(values as any, {
              onSuccess: () => setPlanDialogOpen(false),
            });
          }
        }}
        isSaving={createPlan.isPending || updatePlan.isPending}
      />

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
    </div>
  );
};

const KpiTile: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  accent?: boolean;
}> = ({ icon: Icon, label, value, accent }) => (
  <Card className={accent ? 'border-primary/40' : ''}>
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-md bg-primary/10 text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const PlanCard: React.FC<{
  plan: StrategyPlan;
  progress: number;
  objectiveCount: number;
  initiativeCount: number;
  onSelect: () => void;
  onEdit: () => void;
  onStatusChange: (status: StrategyPlan['status']) => void;
  onDelete: () => void;
}> = ({ plan, progress, objectiveCount, initiativeCount, onSelect, onEdit, onStatusChange, onDelete }) => {
  return (
    <div className="rounded-md border bg-card p-3 hover:shadow-sm transition group">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={onSelect}
          className="text-left font-medium text-sm hover:text-primary line-clamp-2"
        >
          {plan.name}
        </button>
        <Badge className={statusColor[plan.status]} variant="secondary">
          {plan.status.replace('_', ' ')}
        </Badge>
      </div>
      {plan.description && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{plan.description}</p>
      )}
      <div className="mt-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
          <span>Rollup progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-2">
        <span>{objectiveCount} objectives</span>
        <span>·</span>
        <span>{initiativeCount} initiatives</span>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Select value={plan.status} onValueChange={(v) => onStatusChange(v as StrategyPlan['status'])}>
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STRATEGY_STATUS_COLUMNS.map((c) => (
              <SelectItem key={c.key} value={c.key}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onEdit}>
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-destructive"
          onClick={() => {
            if (confirm(`Delete plan "${plan.name}"?`)) onDelete();
          }}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};

const PlanFormDialog: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  plan: StrategyPlan | null;
  onSubmit: (values: Partial<StrategyPlan> & { name: string }) => void;
  isSaving: boolean;
}> = ({ open, onOpenChange, plan, onSubmit, isSaving }) => {
  const [name, setName] = useState(plan?.name ?? '');
  const [description, setDescription] = useState(plan?.description ?? '');
  const [status, setStatus] = useState<StrategyPlan['status']>(plan?.status ?? 'draft');
  const [startDate, setStartDate] = useState(plan?.start_date ?? '');
  const [endDate, setEndDate] = useState(plan?.end_date ?? '');

  React.useEffect(() => {
    setName(plan?.name ?? '');
    setDescription(plan?.description ?? '');
    setStatus(plan?.status ?? 'draft');
    setStartDate(plan?.start_date ?? '');
    setEndDate(plan?.end_date ?? '');
  }, [plan, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{plan ? 'Edit plan' : 'Create strategy plan'}</DialogTitle>
          <DialogDescription>
            A plan groups related objectives and initiatives so progress can roll up.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. FY26 Growth Plan" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start date</Label>
              <Input type="date" value={startDate ?? ''} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>End date</Label>
              <Input type="date" value={endDate ?? ''} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as StrategyPlan['status'])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STRATEGY_STATUS_COLUMNS.map((c) => (
                  <SelectItem key={c.key} value={c.key}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            disabled={!name.trim() || isSaving}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                description: description?.trim() || null,
                status,
                start_date: startDate || null,
                end_date: endDate || null,
              })
            }
          >
            {isSaving ? 'Saving…' : plan ? 'Save changes' : 'Create plan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const PlanDetailDialog: React.FC<{
  plan: StrategyPlan;
  progress: number;
  logs: { id: string; progress: number; note: string | null; created_at: string }[];
  onClose: () => void;
  onAddCheckIn: (progress: number, note: string) => void;
  isSaving: boolean;
}> = ({ plan, progress, logs, onClose, onAddCheckIn, isSaving }) => {
  const [pct, setPct] = useState<number>(progress);
  const [note, setNote] = useState('');

  React.useEffect(() => {
    setPct(progress);
  }, [progress, plan.id]);

  const series = logs
    .slice()
    .sort((a, b) => +new Date(a.created_at) - +new Date(b.created_at))
    .map((l) => ({
      date: format(parseISO(l.created_at), 'MMM d'),
      progress: l.progress,
    }));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{plan.name}</DialogTitle>
          <DialogDescription>{plan.description ?? 'No description'}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={statusColor[plan.status]}>{plan.status.replace('_', ' ')}</Badge>
            <span className="text-sm text-muted-foreground">
              Rollup progress: <strong>{progress}%</strong>
            </span>
          </div>

          {series.length > 1 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis domain={[0, 100]} fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="progress" stroke="hsl(var(--primary))" strokeWidth={2} dot />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">
              Add at least two check-ins to see a progress trend chart.
            </p>
          )}

          <div className="rounded-md border p-3 space-y-2">
            <Label>Add a manual check-in</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={0}
                max={100}
                value={pct}
                onChange={(e) => setPct(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-24"
              />
              <span className="text-sm">%</span>
              <Input
                placeholder="Optional note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="flex-1"
              />
              <Button
                size="sm"
                disabled={isSaving}
                onClick={() => {
                  onAddCheckIn(pct, note);
                  setNote('');
                }}
              >
                {isSaving ? 'Saving…' : 'Log'}
              </Button>
            </div>
          </div>

          {logs.length > 0 && (
            <div className="space-y-1 max-h-40 overflow-auto">
              {logs
                .slice()
                .reverse()
                .map((l) => (
                  <div key={l.id} className="text-xs border-l-2 pl-2 py-1 border-primary/40">
                    <span className="font-medium">{l.progress}%</span>
                    {l.note && <span className="text-muted-foreground"> — {l.note}</span>}
                    <span className="text-muted-foreground/70 ml-2">
                      {format(parseISO(l.created_at), 'MMM d, HH:mm')}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ProgressChart: React.FC<{
  plans: StrategyPlan[];
  logs: { entity_type: string; entity_id: string; progress: number; created_at: string }[];
}> = ({ plans, logs }) => {
  const series = useMemo(() => {
    const planLogs = logs.filter((l) => l.entity_type === 'plan');
    if (planLogs.length === 0) return [];
    const byDate = new Map<string, { date: string; total: number; count: number }>();
    planLogs.forEach((l) => {
      const d = format(parseISO(l.created_at), 'MMM d');
      const cur = byDate.get(d) ?? { date: d, total: 0, count: 0 };
      cur.total += l.progress;
      cur.count += 1;
      byDate.set(d, cur);
    });
    return Array.from(byDate.values()).map((v) => ({
      date: v.date,
      progress: Math.round(v.total / v.count),
    }));
  }, [logs]);

  if (series.length < 2) {
    return (
      <p className="text-sm text-muted-foreground">
        Log progress check-ins on plans to see a trend across all plans here.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={series}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="progress" stroke="hsl(var(--primary))" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Strategy;
