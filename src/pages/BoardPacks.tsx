import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { FileText, Plus, Loader2, Globe, Lock, Trash2, ExternalLink, Copy } from 'lucide-react';
import { useBoardPacks } from '@/hooks/useBoardPacks';
import { toast } from 'sonner';

const BoardPacks = () => {
  const { packs, isLoading, generate, publish, unpublish, remove } = useBoardPacks();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('');
  const [notes, setNotes] = useState('');

  const submit = async () => {
    if (!title.trim()) return;
    await generate.mutateAsync({ title: title.trim(), periodLabel: period.trim() || undefined, notes: notes.trim() || undefined });
    setTitle(''); setPeriod(''); setNotes(''); setOpen(false);
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/strategy/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Public link copied');
  };

  return (
    <PageLayout
      title="Board Packs"
      subtitle="Versioned, signed snapshots of your strategy. Generate, publish, share with investors, regulators, employees."
      icon={<FileText className="w-5 h-5" />}
      actions={
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> Generate pack
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : packs.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-1">No board packs yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate a frozen snapshot of your goals, KPIs and decisions, ready for the next board meeting.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="w-4 h-4 mr-1" /> Generate your first pack
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {packs.map((p: any) => {
            const goalsCount = p.snapshot?.goals?.length ?? 0;
            const decisionsCount = p.snapshot?.decisions?.length ?? 0;
            return (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{p.title}</CardTitle>
                      <CardDescription>
                        {p.period_label ?? 'No period'} · {new Date(p.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>
                      {p.status === 'published' ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {p.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="border rounded p-2">
                      <div className="text-muted-foreground text-xs">Goals snapshot</div>
                      <div className="font-bold text-lg">{goalsCount}</div>
                    </div>
                    <div className="border rounded p-2">
                      <div className="text-muted-foreground text-xs">Decisions</div>
                      <div className="font-bold text-lg">{decisionsCount}</div>
                    </div>
                  </div>
                  {p.notes && <p className="text-sm text-muted-foreground">{p.notes}</p>}
                  <div className="flex flex-wrap gap-2">
                    {p.status === 'published' && p.share_slug ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => copyLink(p.share_slug)}>
                          <Copy className="w-3 h-3 mr-1" /> Copy link
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`/strategy/${p.share_slug}`} target="_blank" rel="noreferrer">
                            <ExternalLink className="w-3 h-3 mr-1" /> View public
                          </a>
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => unpublish.mutate(p.id)}>
                          Unpublish
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => publish.mutate(p)}>
                        <Globe className="w-3 h-3 mr-1" /> Publish
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => remove.mutate(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate board pack</DialogTitle>
            <DialogDescription>
              Captures a frozen snapshot of all current goals and decisions for this organization.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q2 2026 Board Pack" />
            </div>
            <div>
              <Label>Period label</Label>
              <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="Q2 2026" />
            </div>
            <div>
              <Label>Notes (optional)</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Cover note, context, agenda…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={!title.trim() || generate.isPending}>
              {generate.isPending ? 'Generating…' : 'Generate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default BoardPacks;
