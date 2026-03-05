import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AddMarketChangeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AddMarketChangeDialog: React.FC<AddMarketChangeDialogProps> = ({ open, onOpenChange, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', impact_level: 'medium', category: '', source: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setLoading(true);
    const { error } = await supabase.from('market_changes').insert({
      title: form.title,
      description: form.description,
      impact_level: form.impact_level,
      category: form.category || null,
      source: form.source || null,
    });
    setLoading(false);
    if (error) {
      toast.error('Failed to add market change');
      console.error(error);
    } else {
      toast.success('Market change recorded');
      setForm({ title: '', description: '', impact_level: 'medium', category: '', source: '' });
      onOpenChange(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Record Market Change</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New competitor entered market" required />
          </div>
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the market change..." required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Impact Level</Label>
              <Select value={form.impact_level} onValueChange={v => setForm(f => ({ ...f, impact_level: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Regulation" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Source</Label>
            <Input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="e.g. Bloomberg" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Record Change'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMarketChangeDialog;
