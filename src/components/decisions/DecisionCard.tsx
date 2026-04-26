import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CheckCircle2, AlertTriangle, MinusCircle, Trash2, Gavel, Signature } from 'lucide-react';
import { DecisionLog, useDecisionLog, SignoffStance } from '@/hooks/useDecisionLog';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface Props {
  decision: DecisionLog;
}

const stanceMeta: Record<SignoffStance, { label: string; icon: React.ElementType; cls: string }> = {
  approve: { label: 'Approved', icon: CheckCircle2, cls: 'text-green-600' },
  dissent: { label: 'Dissented', icon: AlertTriangle, cls: 'text-red-600' },
  abstain: { label: 'Abstained', icon: MinusCircle, cls: 'text-muted-foreground' },
};

const DecisionCard: React.FC<Props> = ({ decision }) => {
  const { decide, sign, remove } = useDecisionLog();
  const { session } = useSimpleAuth();
  const userId = session?.user?.id;

  const [chosenId, setChosenId] = useState<string>(
    decision.options?.find((o) => o.is_chosen)?.id ?? decision.options?.[0]?.id ?? '',
  );
  const [rationale, setRationale] = useState(decision.final_rationale ?? '');
  const [signComment, setSignComment] = useState('');
  const [stance, setStance] = useState<SignoffStance>('approve');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const mySignoff = decision.signoffs?.find((s) => s.signer_id === userId);
  const decided = decision.status === 'decided';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg">{decision.title}</CardTitle>
              <Badge variant={decided ? 'default' : 'secondary'}>{decision.status}</Badge>
            </div>
            {decision.context && <CardDescription className="mt-1">{decision.context}</CardDescription>}
          </div>
          <Button variant="ghost" size="icon" aria-label="Delete decision" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Options */}
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Options</div>
          {decision.options?.length ? (
            decision.options.map((o) => (
              <div
                key={o.id}
                className={`border rounded-lg p-3 ${
                  o.is_chosen ? 'border-primary bg-primary/5' : 'border-border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="font-medium">{o.label}</div>
                  {o.is_chosen && <Badge>Chosen</Badge>}
                </div>
                {o.description && <div className="text-sm text-muted-foreground mt-1">{o.description}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm">
                  {o.pros && (
                    <div>
                      <span className="font-semibold text-green-600">Pros:</span> {o.pros}
                    </div>
                  )}
                  {o.cons && (
                    <div>
                      <span className="font-semibold text-red-600">Cons:</span> {o.cons}
                    </div>
                  )}
                </div>
                {o.estimated_impact && (
                  <div className="text-sm mt-1">
                    <span className="font-semibold">Impact:</span> {o.estimated_impact}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">No options recorded.</div>
          )}
        </div>

        {/* Decide */}
        {!decided && decision.options && decision.options.length > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
              <Gavel className="w-3 h-3" /> Finalize decision
            </div>
            <Select value={chosenId} onValueChange={setChosenId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose option" />
              </SelectTrigger>
              <SelectContent>
                {decision.options.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder="Final rationale — why this option, who else was consulted, what trade-offs were accepted"
              rows={3}
            />
            <Button
              onClick={() => decide.mutate({ decisionId: decision.id, chosenOptionId: chosenId, rationale })}
              disabled={!chosenId || !rationale.trim() || decide.isPending}
            >
              Mark as decided
            </Button>
          </div>
        )}

        {decided && decision.final_rationale && (
          <div className="border-l-4 border-primary pl-3 py-1 bg-muted/30 rounded-r">
            <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
              Final rationale
            </div>
            <div className="text-sm">{decision.final_rationale}</div>
          </div>
        )}

        {/* Sign-offs */}
        <div className="border-t pt-4 space-y-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
            <Signature className="w-3 h-3" /> Sign-offs ({decision.signoffs?.length ?? 0})
          </div>
          {decision.signoffs?.map((s) => {
            const m = stanceMeta[s.stance];
            const Icon = m.icon;
            return (
              <div key={s.id} className="text-sm flex items-start gap-2 border rounded-md p-2">
                <Icon className={`w-4 h-4 mt-0.5 ${m.cls}`} />
                <div className="flex-1">
                  <div>
                    <span className="font-medium">{m.label}</span>
                    {s.signer_role && <span className="text-muted-foreground"> · {s.signer_role}</span>}
                    <span className="text-muted-foreground"> · {new Date(s.signed_at).toLocaleDateString()}</span>
                  </div>
                  {s.comment && <div className="text-muted-foreground">{s.comment}</div>}
                </div>
              </div>
            );
          })}

          <div className="border rounded-md p-3 space-y-2 bg-muted/20">
            <div className="text-xs font-medium">{mySignoff ? 'Update your signature' : 'Add your signature'}</div>
            <div className="flex gap-2">
              <Select value={stance} onValueChange={(v) => setStance(v as SignoffStance)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="dissent">Dissent</SelectItem>
                  <SelectItem value="abstain">Abstain</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                rows={1}
                placeholder="Comment (optional)"
                value={signComment}
                onChange={(e) => setSignComment(e.target.value)}
              />
              <Button
                onClick={() =>
                  sign.mutate({ decisionId: decision.id, stance, comment: signComment || undefined })
                }
                disabled={sign.isPending}
              >
                Sign
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DecisionCard;
