import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CATEGORIES = ['Market Size', 'Revenue', 'Growth', 'Technology', 'Customer', 'Operations', 'General'];

const AddMetricDialog: React.FC<AddMetricDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', value: '', previous_value: '', category: 'General', source: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.value) return;
    setLoading(true);
    const { error } = await supabase.from('industry_metrics').insert({
      name: form.name,
      value: parseFloat(form.value),
      previous_value: form.previous_value ? parseFloat(form.previous_value) : null,
      category: form.category,
      source: form.source || null,
    });
    setLoading(false);
    if (error) {
      toast.error('Failed to add metric');
      console.error(error);
    } else {
      toast.success('Metric added');
      setForm({ name: '', value: '', previous_value: '', category: 'General', source: '' });
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Add Industry Metric</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Market Share %" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Current Value *</Label>
              <Input type="number" step="any" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label>Previous Value</Label>
              <Input type="number" step="any" value={form.previous_value} onChange={e => setForm(f => ({ ...f, previous_value: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Source</Label>
              <Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. Gartner" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Metric'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMetricDialog;
