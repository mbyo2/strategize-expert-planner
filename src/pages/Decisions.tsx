import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Gavel, Loader2, ShieldCheck } from 'lucide-react';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import NewDecisionDialog from '@/components/decisions/NewDecisionDialog';
import DecisionCard from '@/components/decisions/DecisionCard';

const Decisions = () => {
  const { decisions, isLoading } = useDecisionLog();
  const [open, setOpen] = useState(false);

  const openCount = decisions.filter((d) => d.status === 'open').length;
  const decidedCount = decisions.filter((d) => d.status === 'decided').length;

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
              {decisions.reduce((acc, d) => acc + (d.signoffs?.length ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : decisions.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <Gavel className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No decisions recorded yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start the audit trail. Every strategic choice deserves an option set, a rationale, and a signature.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Record your first decision
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {decisions.map((d) => (
            <DecisionCard key={d.id} decision={d} />
          ))}
        </div>
      )}

      <NewDecisionDialog open={open} onOpenChange={setOpen} />
    </PageLayout>
  );
};

export default Decisions;
