import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Link2, Gavel, Activity, Plus, ExternalLink, FileText, Eye, Loader2 } from 'lucide-react';
import { DialogFooter } from '@/components/ui/dialog';
import StrategyErpBindingPanel from '@/components/strategy/StrategyErpBindingPanel';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import NewDecisionDialog from '@/components/decisions/NewDecisionDialog';
import { useStrategyERPBindings } from '@/hooks/useStrategyERPBindings';
import { useBoardPacks } from '@/hooks/useBoardPacks';
import { Link, useNavigate } from 'react-router-dom';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: any | null;
}

const GoalDetailDialog: React.FC<Props> = ({ open, onOpenChange, goal }) => {
  const { decisions } = useDecisionLog();
  const { bindings, sync } = useStrategyERPBindings(goal?.id);
  const { generate } = useBoardPacks();
  const navigate = useNavigate();
  const [newDecisionOpen, setNewDecisionOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!goal) return null;

  const linkedDecisions = decisions.filter((d) => d.related_goal_id === goal.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{goal.name}</DialogTitle>
              {goal.description && (
                <DialogDescription className="mt-1">{goal.description}</DialogDescription>
              )}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <Badge variant="outline" className="capitalize">{goal.status}</Badge>
                {goal.priority && <Badge variant="secondary" className="capitalize">{goal.priority} priority</Badge>}
                {goal.category && <Badge variant="outline">{goal.category}</Badge>}
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Quick actions */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate(`/decisions?goalId=${goal.id}`);
            }}
          >
            <Gavel className="w-3.5 h-3.5 mr-1.5" /> Go to decisions
            <ExternalLink className="w-3 h-3 ml-1.5 opacity-60" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5" />
            Preview board pack
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setNewDecisionOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> New decision
          </Button>
        </div>

        {/* Quick KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground">Progress</div>
              <div className="text-2xl font-bold">{goal.progress ?? 0}%</div>
              <Progress value={goal.progress ?? 0} className="h-1.5 mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Link2 className="w-3 h-3" /> ERP bindings
              </div>
              <div className="text-2xl font-bold">{bindings.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {bindings.filter((b: any) => b.last_synced_at).length} synced
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Gavel className="w-3 h-3" /> Decisions
              </div>
              <div className="text-2xl font-bold">{linkedDecisions.length}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {linkedDecisions.filter((d) => d.status === 'decided').length} finalized
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bindings" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bindings">
              <Link2 className="w-4 h-4 mr-1" /> Live data
            </TabsTrigger>
            <TabsTrigger value="decisions">
              <Gavel className="w-4 h-4 mr-1" /> Decisions
            </TabsTrigger>
            <TabsTrigger value="metrics">
              <Activity className="w-4 h-4 mr-1" /> Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bindings" className="mt-4">
            <StrategyErpBindingPanel goalId={goal.id} goalName={goal.name} />
            {bindings.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => bindings.forEach((b: any) => sync.mutate(b))}
                disabled={sync.isPending}
              >
                <Activity className="w-3 h-3 mr-1" /> Sync all bindings
              </Button>
            )}
          </TabsContent>

          <TabsContent value="decisions" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Strategic decisions linked to this goal — the human accountability trail.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/decisions">
                    All decisions <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
                <Button size="sm" onClick={() => setNewDecisionOpen(true)}>
                  <Plus className="w-3 h-3 mr-1" /> New decision
                </Button>
              </div>
            </div>

            {linkedDecisions.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gavel className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No decisions linked. Capture trade-offs and sign-offs to lock in accountability.
                  </p>
                </CardContent>
              </Card>
            ) : (
              linkedDecisions.map((d) => {
                const chosen = d.options?.find((o) => o.is_chosen);
                return (
                  <Card key={d.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{d.title}</span>
                            <Badge variant={d.status === 'decided' ? 'default' : 'secondary'} className="capitalize">
                              {d.status}
                            </Badge>
                          </div>
                          {chosen && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Chose: <span className="text-foreground font-medium">{chosen.label}</span>
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground mt-2 flex items-center gap-3">
                            <span>{d.options?.length ?? 0} options</span>
                            <span>{d.signoffs?.length ?? 0} signatures</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          <TabsContent value="metrics" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Current value</div>
                    <div className="text-xl font-bold">{goal.current_value ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Target</div>
                    <div className="text-xl font-bold">{goal.target_value ?? '—'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Start date</div>
                    <div className="text-sm">
                      {goal.start_date ? new Date(goal.start_date).toLocaleDateString() : '—'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Due date</div>
                    <div className="text-sm">
                      {goal.due_date ? new Date(goal.due_date).toLocaleDateString() : '—'}
                    </div>
                  </div>
                </div>
                {goal.target_value != null && goal.current_value != null && (
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Toward target</span>
                      <span className="font-semibold">
                        {Math.round((Number(goal.current_value) / Number(goal.target_value)) * 100)}%
                      </span>
                    </div>
                    <Progress
                      value={Math.min(100, (Number(goal.current_value) / Number(goal.target_value)) * 100)}
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <NewDecisionDialog
          open={newDecisionOpen}
          onOpenChange={setNewDecisionOpen}
          defaultGoalId={goal.id}
        />
      </DialogContent>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" /> Board pack preview
            </DialogTitle>
            <DialogDescription>
              Review the live KPIs that will be frozen into this snapshot for{' '}
              <span className="font-medium text-foreground">{goal.name}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Progress</div>
                  <div className="text-xl font-bold">{goal.progress ?? 0}%</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">ERP bindings</div>
                  <div className="text-xl font-bold">{bindings.length}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {bindings.filter((b: any) => b.last_synced_at).length} synced
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Decisions</div>
                  <div className="text-xl font-bold">{linkedDecisions.length}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {linkedDecisions.filter((d) => d.status === 'decided').length} finalized
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-muted-foreground">Risk</div>
                  <div className="text-xl font-bold capitalize">{goal.risk_level ?? '—'}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Title</span>
                  <span className="font-medium">{goal.name} — Board Pack</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Period</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current value → Target</span>
                  <span className="font-medium">
                    {goal.current_value ?? '—'} → {goal.target_value ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="capitalize">{goal.status}</Badge>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Generating will create an immutable snapshot. Org-wide goals, decisions, ERP bindings,
              initiatives, reviews and industry metrics are also captured.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewOpen(false)}
              disabled={generate.isPending}
            >
              Cancel
            </Button>
            <Button
              disabled={generate.isPending}
              aria-busy={generate.isPending}
              aria-live="polite"
              onClick={() =>
                generate.mutate(
                  {
                    title: `${goal.name} — Board Pack`,
                    periodLabel: new Date().toLocaleDateString(undefined, {
                      month: 'short',
                      year: 'numeric',
                    }),
                    notes: `Generated from goal: ${goal.name}`,
                  },
                  {
                    onSuccess: () => {
                      setPreviewOpen(false);
                      onOpenChange(false);
                      navigate('/board-packs');
                    },
                  }
                )
              }
            >
              {generate.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-1.5" />
                  Confirm & generate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default GoalDetailDialog;
