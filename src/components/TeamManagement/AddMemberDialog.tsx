
import React, { useState } from 'react';
import { useTeams } from '@/hooks/useTeams';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AddMemberDialogProps {
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMemberDialog = ({ teamId, open, onOpenChange }: AddMemberDialogProps) => {
  const { addMember } = useTeams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addMember(teamId, {
        name,
        email,
        role,
        department,
        position,
        joinedDate: new Date().toISOString().split('T')[0]
      });
      
      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('Member');
    setDepartment('');
    setPosition('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="member-name">Name *</Label>
              <Input
                id="member-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-email">Email *</Label>
              <Input
                id="member-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-role">Role *</Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="member-role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  <SelectItem value="Contributor">Contributor</SelectItem>
                  <SelectItem value="Observer">Observer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-department">Department</Label>
              <Input
                id="member-department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="member-position">Position</Label>
              <Input
                id="member-position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name || !email || isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
