
import React, { useState } from 'react';
import { usePlanningInitiatives } from '@/hooks/usePlanningInitiatives';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import PlanningInitiativeDialog from './PlanningInitiativeDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PlanningInitiativesManager = () => {
  const { initiatives, isLoading, createInitiative, updateInitiative, deleteInitiative, isDeleting } = usePlanningInitiatives();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState(null);
  const [deletingInitiativeId, setDeletingInitiativeId] = useState<string | null>(null);

  const handleCreateInitiative = (data: any) => {
    createInitiative(data);
    setIsDialogOpen(false);
  };

  const handleUpdateInitiative = (data: any) => {
    if (editingInitiative) {
      updateInitiative({
        id: editingInitiative.id,
        updates: data,
      });
      setEditingInitiative(null);
      setIsDialogOpen(false);
    }
  };

  const handleDeleteInitiative = () => {
    if (deletingInitiativeId) {
      deleteInitiative(deletingInitiativeId);
      setDeletingInitiativeId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Planning Initiatives</h2>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Initiative
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initiatives.map((initiative) => (
          <Card key={initiative.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{initiative.name}</CardTitle>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingInitiative(initiative);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingInitiativeId(initiative.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Badge className={getStatusColor(initiative.status)}>
                {initiative.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {initiative.description && (
                  <p className="text-sm text-muted-foreground">{initiative.description}</p>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{initiative.progress}%</span>
                  </div>
                  <Progress value={initiative.progress} className="h-2" />
                </div>

                <div className="text-sm space-y-1">
                  {initiative.start_date && (
                    <div>Start: {new Date(initiative.start_date).toLocaleDateString()}</div>
                  )}
                  {initiative.end_date && (
                    <div>End: {new Date(initiative.end_date).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PlanningInitiativeDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingInitiative(null);
          }
        }}
        initiative={editingInitiative}
        onSubmit={editingInitiative ? handleUpdateInitiative : handleCreateInitiative}
      />

      <AlertDialog open={!!deletingInitiativeId} onOpenChange={() => setDeletingInitiativeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Planning Initiative</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this planning initiative? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteInitiative}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanningInitiativesManager;
