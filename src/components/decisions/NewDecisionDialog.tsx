import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultGoalId?: string | null;
}

const blankOption = () => ({ label: '', description: '', pros: '', cons: '', estimated_impact: '' });

const NewDecisionDialog: React.FC<Props> = ({ open, onOpenChange, defaultGoalId }) => {
  const { createDecision } = useDecisionLog();
  const { goals } = useStrategicGoals();
  const [title, setTitle] = useState('');
  const [context, setContext] = useState('');
  const [goalId, setGoalId] = useState<string>(defaultGoalId ?? 'none');
  const [options, setOptions] = useState([blankOption(), blankOption()]);

  React.useEffect(() => {
    if (open && defaultGoalId) setGoalId(defaultGoalId);
  }, [open, defaultGoalId]);

  const reset = () => {
    setTitle('');
    setContext('');
    setGoalId(defaultGoalId ?? 'none');
    setOptions([blankOption(), blankOption()]);
  };

  const submit = async () => {
    if (!title.trim()) return;
    const cleaned = options.filter((o) => o.label.trim());
    await createDecision.mutateAsync({
      title: title.trim(),
      context: context.trim() || undefined,
      related_goal_id: goalId === 'none' ? null : goalId,
      options: cleaned,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Record a strategic decision</DialogTitle>
          <DialogDescription>
            Capture options, trade-offs, and rationale. This is the human accountability trail AI can't replace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Decision title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Enter the EU market in 2027" />
          </div>
          <div>
            <Label>Context</Label>
            <Textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Why this decision is on the table, constraints, deadlines…"
              rows={3}
            />
          </div>
          <div>
            <Label>Linked strategic goal (optional)</Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="No goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No linked goal</SelectItem>
                {goals.map((g: any) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options considered</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOptions((o) => [...o, blankOption()])}
              >
                <Plus className="w-4 h-4 mr-1" /> Add option
              </Button>
            </div>
            {options.map((opt, idx) => (
              <div key={idx} className="border rounded-lg p-3 space-y-2 bg-muted/30">
                <div className="flex items-center justify-between gap-2">
                  <Input
                    placeholder={`Option ${idx + 1} label`}
                    value={opt.label}
                    onChange={(e) =>
                      setOptions((arr) => arr.map((o, i) => (i === idx ? { ...o, label: e.target.value } : o)))
                    }
                  />
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setOptions((arr) => arr.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  placeholder="Description"
                  rows={2}
                  value={opt.description}
                  onChange={(e) =>
                    setOptions((arr) => arr.map((o, i) => (i === idx ? { ...o, description: e.target.value } : o)))
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Textarea
                    placeholder="Pros"
                    rows={2}
                    value={opt.pros}
                    onChange={(e) =>
                      setOptions((arr) => arr.map((o, i) => (i === idx ? { ...o, pros: e.target.value } : o)))
                    }
                  />
                  <Textarea
                    placeholder="Cons / risks"
                    rows={2}
                    value={opt.cons}
                    onChange={(e) =>
                      setOptions((arr) => arr.map((o, i) => (i === idx ? { ...o, cons: e.target.value } : o)))
                    }
                  />
                </div>
                <Input
                  placeholder="Estimated impact (e.g. +€2M revenue, -3 months delay)"
                  value={opt.estimated_impact}
                  onChange={(e) =>
                    setOptions((arr) =>
                      arr.map((o, i) => (i === idx ? { ...o, estimated_impact: e.target.value } : o)),
                    )
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!title.trim() || createDecision.isPending}>
            {createDecision.isPending ? 'Recording…' : 'Record decision'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewDecisionDialog;
