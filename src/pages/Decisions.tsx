import React, { useMemo, useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Gavel, Loader2, ShieldCheck, X } from 'lucide-react';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import NewDecisionDialog from '@/components/decisions/NewDecisionDialog';
import DecisionCard from '@/components/decisions/DecisionCard';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { useSearchParams } from 'react-router-dom';

const Decisions = () => {
  const { decisions, isLoading } = useDecisionLog();
  const { goals } = useStrategicGoals();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterGoalId = searchParams.get('goal');

  const filteredDecisions = useMemo(() => {
    if (!filterGoalId) return decisions;
    return decisions.filter((d) => d.related_goal_id === filterGoalId);
  }, [decisions, filterGoalId]);

  const filterGoalName = filterGoalId ? goals.find((g) => g.id === filterGoalId)?.name : null;

  const openCount = filteredDecisions.filter((d) => d.status === 'open').length;
  const decidedCount = filteredDecisions.filter((d) => d.status === 'decided').length;

  const clearFilter = () => {
    searchParams.delete('goal');
    setSearchParams(searchParams);
  };

  return (
    <PageLayout
      title="Decision Log"
      subtitle="The human accountability trail. Capture options, trade-offs, and signatures — the part of strategy AI can't replace."
      icon={<Gavel className="w-5 h-5" />}
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New decision
        </Button>
      }
    >
      {filterGoalName && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            Filtered by goal: {filterGoalName}
            <button onClick={clearFilter} className="ml-1 hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Open</div>
            <div className="text-2xl font-bold">{openCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Decided</div>
            <div className="text-2xl font-bold">{decidedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Total signed
            </div>
            <div className="text-2xl font-bold">
              {filteredDecisions.reduce((acc, d) => acc + (d.signoffs?.length ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filteredDecisions.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Gavel className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No decisions {filterGoalName ? 'for this goal' : 'recorded yet'}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start the audit trail. Every strategic choice deserves an option set, a rationale, and a signature.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Record {filterGoalName ? 'a decision for this goal' : 'your first decision'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDecisions.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      <NewDecisionDialog open={open} onOpenChange={setOpen} defaultGoalId={filterGoalId} />
    </PageLayout>
  );
};

export default Decisions;
