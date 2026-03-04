import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';

interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea';
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface ERPEntityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleKey: string;
  entityType: string;
  title: string;
  fields: FieldDef[];
}

const ERPEntityDialog: React.FC<ERPEntityDialogProps> = ({
  open, onOpenChange, moduleKey, entityType, title, fields
}) => {
  const { organizationId } = useOrganization();
  const { createEntity, isCreating } = useERPEntities(organizationId || '', moduleKey, entityType);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizationId) return;

    createEntity({
      organization_id: organizationId,
      module_key: moduleKey,
      entity_type: entityType,
      entity_data: formData,
      metadata: {}
    }, {
      onSuccess: () => {
        setFormData({});
        onOpenChange(false);
      }
    });
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>Fill in the details below to create a new record.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map(field => (
              <div key={field.key} className="grid gap-2">
                <Label htmlFor={field.key}>{field.label}{field.required && ' *'}</Label>
                {field.type === 'text' && (
                  <Input
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={e => updateField(field.key, e.target.value)}
                    required={field.required}
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    id={field.key}
                    type="number"
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={e => updateField(field.key, parseFloat(e.target.value) || 0)}
                    required={field.required}
                  />
                )}
                {field.type === 'select' && (
                  <Select value={formData[field.key] || ''} onValueChange={v => updateField(field.key, v)}>
                    <SelectTrigger><SelectValue placeholder={field.placeholder || 'Select...'} /></SelectTrigger>
                    <SelectContent>
                      {field.options?.map(opt => (
                        <SelectItem key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1).replace(/_/g, ' ')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.key}
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={e => updateField(field.key, e.target.value)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ERPEntityDialog;

// Pre-configured field sets for common entity types
export const ENTITY_FIELDS = {
  account: [
    { key: 'name', label: 'Account Name', type: 'text' as const, required: true, placeholder: 'e.g. Operating Account' },
    { key: 'type', label: 'Account Type', type: 'select' as const, options: ['checking', 'savings', 'credit', 'investment'], required: true },
    { key: 'balance', label: 'Opening Balance', type: 'number' as const, placeholder: '0.00' },
  ],
  transaction: [
    { key: 'description', label: 'Description', type: 'text' as const, required: true, placeholder: 'e.g. Monthly rent' },
    { key: 'type', label: 'Type', type: 'select' as const, options: ['income', 'expense'], required: true },
    { key: 'amount', label: 'Amount', type: 'number' as const, required: true, placeholder: '0.00' },
    { key: 'category', label: 'Category', type: 'text' as const, placeholder: 'e.g. Office Expenses' },
  ],
  customer: [
    { key: 'name', label: 'Customer Name', type: 'text' as const, required: true, placeholder: 'e.g. Acme Corp' },
    { key: 'contact', label: 'Contact Email', type: 'text' as const, placeholder: 'email@example.com' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'prospect', 'inactive'], required: true },
    { key: 'revenue', label: 'Annual Revenue', type: 'number' as const, placeholder: '0' },
  ],
  lead: [
    { key: 'name', label: 'Lead Name', type: 'text' as const, required: true, placeholder: 'e.g. John Smith' },
    { key: 'company', label: 'Company', type: 'text' as const, placeholder: 'e.g. Tech Solutions' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['new', 'contacted', 'qualified', 'converted', 'lost'], required: true },
    { key: 'source', label: 'Source', type: 'select' as const, options: ['website', 'referral', 'cold_call', 'event', 'other'] },
  ],
  deal: [
    { key: 'name', label: 'Deal Name', type: 'text' as const, required: true, placeholder: 'e.g. Enterprise License' },
    { key: 'value', label: 'Deal Value', type: 'number' as const, required: true, placeholder: '0' },
    { key: 'stage', label: 'Pipeline Stage', type: 'select' as const, options: ['prospecting', 'qualification', 'proposal', 'negotiation', 'closing'], required: true },
    { key: 'customer', label: 'Customer', type: 'text' as const, placeholder: 'Customer name' },
  ],
  employee: [
    { key: 'name', label: 'Full Name', type: 'text' as const, required: true, placeholder: 'e.g. Jane Doe' },
    { key: 'position', label: 'Position', type: 'text' as const, placeholder: 'e.g. Software Engineer' },
    { key: 'department', label: 'Department', type: 'text' as const, placeholder: 'e.g. Engineering' },
    { key: 'salary', label: 'Annual Salary', type: 'number' as const, placeholder: '0' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['active', 'on_leave', 'terminated'], required: true },
  ],
  order: [
    { key: 'customer', label: 'Customer', type: 'text' as const, required: true, placeholder: 'Customer name' },
    { key: 'amount', label: 'Order Amount', type: 'number' as const, required: true, placeholder: '0.00' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['pending', 'processing', 'shipped', 'completed', 'cancelled'], required: true },
    { key: 'notes', label: 'Notes', type: 'textarea' as const, placeholder: 'Additional details...' },
  ],
  inventory_item: [
    { key: 'name', label: 'Item Name', type: 'text' as const, required: true, placeholder: 'e.g. Widget A' },
    { key: 'sku', label: 'SKU', type: 'text' as const, placeholder: 'e.g. WGT-001' },
    { key: 'quantity', label: 'Quantity', type: 'number' as const, required: true, placeholder: '0' },
    { key: 'unit_price', label: 'Unit Price', type: 'number' as const, placeholder: '0.00' },
    { key: 'low_stock_threshold', label: 'Low Stock Alert', type: 'number' as const, placeholder: '10' },
  ],
  purchase_order: [
    { key: 'supplier', label: 'Supplier', type: 'text' as const, required: true, placeholder: 'Supplier name' },
    { key: 'amount', label: 'Total Amount', type: 'number' as const, required: true, placeholder: '0.00' },
    { key: 'category', label: 'Category', type: 'text' as const, placeholder: 'e.g. Office Supplies' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['draft', 'pending', 'approved', 'received', 'cancelled'], required: true },
  ],
  supplier: [
    { key: 'name', label: 'Supplier Name', type: 'text' as const, required: true, placeholder: 'e.g. Global Parts Inc' },
    { key: 'contact', label: 'Contact Email', type: 'text' as const, placeholder: 'email@supplier.com' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number' as const, placeholder: '5' },
    { key: 'total_spend', label: 'Total Spend', type: 'number' as const, placeholder: '0' },
  ],
  work_order: [
    { key: 'product', label: 'Product', type: 'text' as const, required: true, placeholder: 'Product name' },
    { key: 'quantity', label: 'Quantity', type: 'number' as const, required: true, placeholder: '0' },
    { key: 'priority', label: 'Priority', type: 'select' as const, options: ['low', 'medium', 'high', 'critical'], required: true },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['pending', 'in_progress', 'completed', 'cancelled'], required: true },
    { key: 'due_date', label: 'Due Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  ],
  shipment: [
    { key: 'origin', label: 'Origin', type: 'text' as const, required: true, placeholder: 'e.g. New York' },
    { key: 'destination', label: 'Destination', type: 'text' as const, required: true, placeholder: 'e.g. Los Angeles' },
    { key: 'cargo', label: 'Cargo Description', type: 'text' as const, placeholder: 'e.g. Electronics' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['pending', 'in_transit', 'delivered', 'cancelled'], required: true },
  ],
  project: [
    { key: 'name', label: 'Project Name', type: 'text' as const, required: true, placeholder: 'e.g. Website Redesign' },
    { key: 'manager', label: 'Project Manager', type: 'text' as const, placeholder: 'Manager name' },
    { key: 'budget', label: 'Budget', type: 'number' as const, placeholder: '0' },
    { key: 'status', label: 'Status', type: 'select' as const, options: ['planning', 'active', 'on_hold', 'completed', 'cancelled'], required: true },
    { key: 'start_date', label: 'Start Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
    { key: 'end_date', label: 'End Date', type: 'text' as const, placeholder: 'YYYY-MM-DD' },
  ],
};
