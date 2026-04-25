import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link2, Zap, Target, Gavel, RefreshCw, ArrowRight, FileText } from 'lucide-react';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { useStrategyERPBindings } from '@/hooks/useStrategyERPBindings';
import { useGoalIntegrationCounts } from '@/hooks/useGoalIntegrationCounts';
import ERPStrategicIntegration from '@/components/erp/ERPStrategicIntegration';
import { toast } from 'sonner';

interface Props {
  organizationId: string;
}

const StrategyOSPanel: React.FC<Props> = ({ organizationId }) => {
  const { goals } = useStrategicGoals();
  const { bindings, sync } = useStrategyERPBindings();
  const goalIds = React.useMemo(() => goals.map((g) => g.id), [goals]);
  const { data: integrationMap = {} } = useGoalIntegrationCounts(goalIds);

  const goalsWithBindings = goals.filter((g) => (integrationMap[g.id]?.bindings ?? 0) > 0);
  const goalsWithoutBindings = goals.filter((g) => (integrationMap[g.id]?.bindings ?? 0) === 0);
  const totalDecisions = Object.values(integrationMap).reduce((s, v) => s + v.decisions, 0);
  const syncedCount = bindings.filter((b: any) => b.last_synced_at).length;

  const syncAll = async () => {
    if (bindings.length === 0) return;
    toast.message(`Syncing ${bindings.length} bindings…`);
    for (const b of bindings) {
      try { await sync.mutateAsync(b as any); } catch (e) { /* toast handled inside */ }
    }
    toast.success('All bindings synced');
  };

  return (
    <div className="space-y-6">
      {/* Hero KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Target className="w-3 h-3" /> Strategic goals
            </div>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">{goalsWithBindings.length} live</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" /> Live ERP bindings
            </div>
            <div className="text-2xl font-bold">{bindings.length}</div>
            <p className="text-xs text-muted-foreground">{syncedCount} synced</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Gavel className="w-3 h-3" /> Decisions
            </div>
            <div className="text-2xl font-bold">{totalDecisions}</div>
            <Button asChild variant="link" size="sm" className="px-0 h-auto text-xs">
              <Link to="/decisions">View log <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex flex-col gap-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="w-3 h-3" /> Board pack
            </div>
            <Button asChild size="sm" variant="default" className="w-fit">
              <Link to="/board-packs">Generate <ArrowRight className="w-3 h-3 ml-1" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Live bindings dashboard */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-primary" /> Live Strategy ↔ ERP bindings
            </CardTitle>
            <CardDescription>
              Each goal pulls its current value directly from your operational data. No more stale plans.
            </CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={syncAll} disabled={sync.isPending || bindings.length === 0}>
            <RefreshCw className={`w-3 h-3 mr-1 ${sync.isPending ? 'animate-spin' : ''}`} /> Sync all
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {goalsWithBindings.length === 0 ? (
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">No goals are bound to ERP data yet</p>
              <p className="text-xs text-muted-foreground mb-3">
                Open any goal and add a binding to make its progress update automatically.
              </p>
              <Button asChild size="sm">
                <Link to="/goals">Open goals <ArrowRight className="w-3 h-3 ml-1" /></Link>
              </Button>
            </div>
          ) : (
            goalsWithBindings.map((g) => {
              const integ = integrationMap[g.id];
              return (
                <Link
                  key={g.id}
                  to={`/goals?goal=${g.id}`}
                  className="block border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{g.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {integ.bindings} binding{integ.bindings !== 1 ? 's' : ''}
                        {integ.lastSyncedValue != null && (
                          <> · current <strong className="text-foreground">{integ.lastSyncedValue}</strong></>
                        )}
                        {g.target_value != null && <> / target {g.target_value}</>}
                      </div>
                      <Progress value={g.progress ?? 0} className="h-1.5 mt-2" />
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">Progress</div>
                      <div className="font-bold">{g.progress ?? 0}%</div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}

          {goalsWithoutBindings.length > 0 && (
            <details className="border rounded-lg">
              <summary className="px-3 py-2 text-sm cursor-pointer text-muted-foreground hover:text-foreground">
                {goalsWithoutBindings.length} goal{goalsWithoutBindings.length !== 1 ? 's' : ''} without live bindings
              </summary>
              <div className="px-3 pb-3 space-y-1">
                {goalsWithoutBindings.map((g) => (
                  <Link
                    key={g.id}
                    to={`/goals?goal=${g.id}`}
                    className="flex items-center justify-between text-sm py-1.5 px-2 rounded hover:bg-muted"
                  >
                    <span className="truncate">{g.name}</span>
                    <Badge variant="outline" className="text-xs shrink-0 ml-2">Add binding</Badge>
                  </Link>
                ))}
              </div>
            </details>
          )}
        </CardContent>
      </Card>

      {/* Legacy generic links (for non-binding workflow) */}
      <details className="border rounded-lg bg-card">
        <summary className="px-4 py-3 cursor-pointer text-sm font-medium flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          Manual strategic links (advanced)
        </summary>
        <div className="px-4 pb-4">
          <ERPStrategicIntegration organizationId={organizationId} />
        </div>
      </details>
    </div>
  );
};

export default StrategyOSPanel;
