import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompetitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  competitor?: any;
}

const CompetitorDialog: React.FC<CompetitorDialogProps> = ({ open, onOpenChange, onSuccess, competitor }) => {
  const isEdit = !!competitor;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: competitor?.name || '',
    description: competitor?.description || '',
    market_share: competitor?.market_share?.toString() || '',
    website: competitor?.website || '',
    industry: competitor?.industry || '',
    strengths: competitor?.strengths?.join(', ') || '',
    threats: competitor?.threats?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    setLoading(true);

    const payload = {
      name: form.name,
      description: form.description || null,
      market_share: form.market_share ? parseFloat(form.market_share) : 0,
      website: form.website || null,
      industry: form.industry || null,
      strengths: form.strengths ? form.strengths.split(',').map(s => s.trim()).filter(Boolean) : [],
      threats: form.threats ? form.threats.split(',').map(s => s.trim()).filter(Boolean) : [],
    };

    const { error } = isEdit
      ? await supabase.from('competitors').update(payload).eq('id', competitor.id)
      : await supabase.from('competitors').insert({ ...payload, created_by: (await supabase.auth.getUser()).data.user?.id });

    setLoading(false);
    if (error) {
      toast.error(`Failed to ${isEdit ? 'update' : 'add'} competitor`);
      console.error(error);
    } else {
      toast.success(`Competitor ${isEdit ? 'updated' : 'added'}`);
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>{isEdit ? 'Edit' : 'Add'} Competitor</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Market Share %</Label>
              <Input type="number" step="0.1" value={form.market_share} onChange={e => setForm(f => ({ ...f, market_share: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Website</Label>
              <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Strengths (comma-separated)</Label>
            <Input value={form.strengths} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))} placeholder="e.g. Brand recognition, Large R&D budget" />
          </div>
          <div className="space-y-2">
            <Label>Threats (comma-separated)</Label>
            <Input value={form.threats} onChange={e => setForm(f => ({ ...f, threats: e.target.value }))} placeholder="e.g. Aggressive pricing, New product line" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : isEdit ? 'Update' : 'Add Competitor'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompetitorDialog;
