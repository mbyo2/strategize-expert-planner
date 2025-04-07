import React, { useState, useEffect } from 'react';
import { 
  fetchPlanningInitiatives, 
  createPlanningInitiative, 
  updatePlanningInitiative, 
  deletePlanningInitiative 
} from '@/services/planningInitiativesService';
import { PlanningInitiative } from '@/types/database';
import PageLayout from '@/components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FilePenLine, FileStack, BookMarked, ArrowRight, ChevronRight, Sparkles, BarChart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { fetchCompanyStrategy, CompanyStrategy, updateCompanyStrategy } from '@/services/companyStrategyService';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import StrategySection from '@/components/StrategySection';
import { Skeleton } from '@/components/ui/skeleton';

// Form schema for company strategy
const strategySchema = z.object({
  vision: z.string().optional(),
  mission: z.string().optional(),
});

// Form schema for planning initiative
const initiativeSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  status: z.enum(['planning', 'in-progress', 'completed', 'cancelled']),
  progress: z.number().min(0).max(100),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

type StrategyFormValues = z.infer<typeof strategySchema>;
type InitiativeFormValues = z.infer<typeof initiativeSchema>;

const Planning = () => {
  const { user } = useAuth();
  const [companyStrategy, setCompanyStrategy] = useState<CompanyStrategy | null>(null);
  const [initiatives, setInitiatives] = useState<PlanningInitiative[]>([]);
  const [loading, setLoading] = useState(true);
  const [openStrategyDialog, setOpenStrategyDialog] = useState(false);
  const [openInitiativeDialog, setOpenInitiativeDialog] = useState(false);
  const [editingInitiative, setEditingInitiative] = useState<PlanningInitiative | null>(null);
  
  // Create forms
  const strategyForm = useForm<StrategyFormValues>({
    resolver: zodResolver(strategySchema),
    defaultValues: {
      vision: '',
      mission: '',
    },
  });
  
  const initiativeForm = useForm<InitiativeFormValues>({
    resolver: zodResolver(initiativeSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'planning',
      progress: 0,
      start_date: '',
      end_date: '',
    },
  });
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [strategyData, initiativesData] = await Promise.all([
          fetchCompanyStrategy(),
          fetchPlanningInitiatives(),
        ]);
        
        setCompanyStrategy(strategyData);
        setInitiatives(initiativesData);
        
        // Initialize strategy form with existing data
        if (strategyData) {
          strategyForm.reset({
            vision: strategyData.vision || '',
            mission: strategyData.mission || '',
          });
        }
      } catch (error) {
        console.error('Error loading planning data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Handle strategy form submission
  const onStrategySubmit = async (data: StrategyFormValues) => {
    if (!user) return;
    
    try {
      const updatedStrategy = await updateCompanyStrategy(data, user.id);
      setCompanyStrategy(updatedStrategy);
      setOpenStrategyDialog(false);
    } catch (error) {
      console.error('Error updating company strategy:', error);
    }
  };
  
  // Handle initiative form submission
  const onInitiativeSubmit = async (data: InitiativeFormValues) => {
    if (!user) return;
    
    try {
      if (editingInitiative) {
        // Update existing initiative
        const updatedInitiative = await updatePlanningInitiative(
          editingInitiative.id,
          data
        );
        
        setInitiatives(prev => 
          prev.map(i => i.id === updatedInitiative.id ? updatedInitiative : i)
        );
      } else {
        // Create new initiative
        const newInitiative = await createPlanningInitiative({
          name: data.name,
          description: data.description,
          status: data.status,
          progress: data.progress || 0,
          start_date: data.start_date,
          end_date: data.end_date,
          owner_id: user.id,
        });
        
        setInitiatives(prev => [...prev, newInitiative]);
      }
      
      // Reset form and close dialog
      initiativeForm.reset();
      setEditingInitiative(null);
      setOpenInitiativeDialog(false);
    } catch (error) {
      console.error('Error saving planning initiative:', error);
    }
  };
  
  // Handle initiative edit
  const handleEditInitiative = (initiative: PlanningInitiative) => {
    setEditingInitiative(initiative);
    
    initiativeForm.reset({
      name: initiative.name,
      description: initiative.description || '',
      status: initiative.status as any,
      progress: initiative.progress,
      start_date: initiative.start_date ? new Date(initiative.start_date).toISOString().split('T')[0] : '',
      end_date: initiative.end_date ? new Date(initiative.end_date).toISOString().split('T')[0] : '',
    });
    
    setOpenInitiativeDialog(true);
  };
  
  // Handle initiative delete
  const handleDeleteInitiative = async (id: string) => {
    try {
      await deletePlanningInitiative(id);
      setInitiatives(prev => prev.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting planning initiative:', error);
    }
  };
  
  return (
    <PageLayout 
      title="Strategic Planning" 
      subtitle="Define your organization's strategic direction and planning initiatives"
      icon={<FilePenLine className="h-6 w-6" />}
    >
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="initiatives">Planning Initiatives</TabsTrigger>
          <TabsTrigger value="strategy">Strategy Framework</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookMarked className="h-5 w-5 mr-2" />
                  Mission & Vision
                </CardTitle>
                <CardDescription>
                  Define your organization's purpose and long-term aspirations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-20 mb-1" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Vision</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded min-h-20">
                        {companyStrategy?.vision || "No vision statement defined yet."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Mission</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded min-h-20">
                        {companyStrategy?.mission || "No mission statement defined yet."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setOpenStrategyDialog(true)}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {companyStrategy ? "Update Mission & Vision" : "Define Mission & Vision"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileStack className="h-5 w-5 mr-2" />
                  Planning Initiatives
                </CardTitle>
                <CardDescription>
                  Track your strategic planning activities and initiatives
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : initiatives.length > 0 ? (
                  <div className="space-y-4">
                    {initiatives.slice(0, 3).map(initiative => (
                      <div key={initiative.id} className="border rounded-md p-3">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium text-sm">{initiative.name}</h4>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {initiative.status}
                          </span>
                        </div>
                        <Progress value={initiative.progress} className="h-1.5 mb-1" />
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            Progress: {initiative.progress}%
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {initiative.end_date ? `Due: ${format(new Date(initiative.end_date), 'MMM d, yyyy')}` : 'No deadline'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {initiatives.length > 3 && (
                      <Button variant="ghost" size="sm" className="w-full text-primary mt-2">
                        View all {initiatives.length} initiatives <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      No planning initiatives created yet.
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => {
                    setEditingInitiative(null);
                    initiativeForm.reset({
                      name: '',
                      description: '',
                      status: 'planning',
                      progress: 0,
                      start_date: '',
                      end_date: '',
                    });
                    setOpenInitiativeDialog(true);
                  }}
                  className="w-full"
                  disabled={loading}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Initiative
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Strategy Performance Overview
                </CardTitle>
                <CardDescription>
                  Monitor your strategy implementation and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Goals Completion</h4>
                      <span className="text-lg font-bold text-primary">68%</span>
                    </div>
                    <Progress value={68} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      13 of 19 strategic goals on track
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Resource Allocation</h4>
                      <span className="text-lg font-bold text-primary">85%</span>
                    </div>
                    <Progress value={85} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Resources aligned with strategic priorities
                    </p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-sm">Strategy Alignment</h4>
                      <span className="text-lg font-bold text-primary">72%</span>
                    </div>
                    <Progress value={72} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">
                      Team activities aligned with strategy
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="initiatives">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Planning Initiatives</CardTitle>
                  <CardDescription>
                    Create and manage your strategic planning initiatives
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => {
                    setEditingInitiative(null);
                    initiativeForm.reset({
                      name: '',
                      description: '',
                      status: 'planning',
                      progress: 0,
                      start_date: '',
                      end_date: '',
                    });
                    setOpenInitiativeDialog(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Initiative
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : initiatives.length > 0 ? (
                <div className="space-y-4">
                  {initiatives.map(initiative => (
                    <div key={initiative.id} className="border rounded-lg p-4">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{initiative.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          initiative.status === 'completed' ? 'bg-green-100 text-green-800' :
                          initiative.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                          initiative.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {initiative.status}
                        </span>
                      </div>
                      
                      {initiative.description && (
                        <p className="text-sm text-muted-foreground mt-2">{initiative.description}</p>
                      )}
                      
                      <div className="mt-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-muted-foreground">Progress: {initiative.progress}%</span>
                          <span className="text-xs text-muted-foreground">
                            {initiative.start_date && `Started: ${format(new Date(initiative.start_date), 'MMM d, yyyy')}`}
                            {initiative.start_date && initiative.end_date && ' • '}
                            {initiative.end_date && `Due: ${format(new Date(initiative.end_date), 'MMM d, yyyy')}`}
                          </span>
                        </div>
                        <Progress value={initiative.progress} className="h-2" />
                      </div>
                      
                      <div className="flex gap-2 mt-4 justify-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditInitiative(initiative)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteInitiative(initiative.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Initiatives Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Create your first planning initiative to start tracking your strategic activities
                  </p>
                  <Button 
                    onClick={() => {
                      setEditingInitiative(null);
                      initiativeForm.reset({
                        name: '',
                        description: '',
                        status: 'planning',
                        progress: 0,
                        start_date: '',
                        end_date: '',
                      });
                      setOpenInitiativeDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Initiative
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="strategy">
          <StrategySection title="Strategy Framework">
            <div className="p-4">
              <p>Strategic framework content will be displayed here.</p>
            </div>
          </StrategySection>
        </TabsContent>
      </Tabs>
      
      {/* Mission & Vision Dialog */}
      <Dialog open={openStrategyDialog} onOpenChange={setOpenStrategyDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Mission & Vision Statements</DialogTitle>
            <DialogDescription>
              Define your organization's purpose and long-term aspirations.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...strategyForm}>
            <form onSubmit={strategyForm.handleSubmit(onStrategySubmit)} className="space-y-6">
              <FormField
                control={strategyForm.control}
                name="vision"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vision Statement</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Our vision is to..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A vision statement describes the desired future position of your organization.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={strategyForm.control}
                name="mission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mission Statement</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Our mission is to..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      A mission statement explains the company's reason for existence and how it serves its customers.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenStrategyDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Initiative Dialog */}
      <Dialog open={openInitiativeDialog} onOpenChange={setOpenInitiativeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingInitiative ? "Edit Initiative" : "Create New Initiative"}
            </DialogTitle>
            <DialogDescription>
              {editingInitiative
                ? "Update the details of your planning initiative."
                : "Add a new strategic planning initiative to track."
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...initiativeForm}>
            <form onSubmit={initiativeForm.handleSubmit(onInitiativeSubmit)} className="space-y-6">
              <FormField
                control={initiativeForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initiative Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Market Expansion Strategy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={initiativeForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe the initiative's objectives and approach..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={initiativeForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="planning">Planning</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={initiativeForm.control}
                  name="progress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Progress (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="0"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={initiativeForm.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={initiativeForm.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpenInitiativeDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingInitiative ? "Update Initiative" : "Create Initiative"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Planning;
