
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileCog, FileSpreadsheet, FileText, Link2, ExternalLink, ArrowUpRight, Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Resource {
  id: string;
  title: string;
  description?: string;
  type: 'document' | 'spreadsheet' | 'presentation' | 'link';
  url: string;
  author: {
    name: string;
    avatar?: string;
  };
  createdAt: Date;
  tags: string[];
  featured: boolean;
}

const ResourceListSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-start space-x-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <div className="flex space-x-2 mt-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddResourceDialog, setShowAddResourceDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    tags: '',
  });

  // Mock data fetch
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const mockResources: Resource[] = [
          {
            id: '1',
            title: 'Strategic Planning Framework',
            description: 'Comprehensive guide to our strategic planning methodology and process',
            type: 'document',
            url: '#',
            author: {
              name: 'Sarah Johnson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            },
            createdAt: new Date(2024, 3, 12),
            tags: ['Framework', 'Planning'],
            featured: true,
          },
          {
            id: '2',
            title: 'Industry Competitive Analysis',
            description: 'Q1 2024 competitive analysis of key industry players and market trends',
            type: 'spreadsheet',
            url: '#',
            author: {
              name: 'Michael Chen',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
            },
            createdAt: new Date(2024, 3, 5),
            tags: ['Analysis', 'Competition'],
            featured: true,
          },
          {
            id: '3',
            title: 'Strategic Goals Tracker',
            description: 'Live tracking spreadsheet for all strategic goals and KPIs',
            type: 'spreadsheet',
            url: '#',
            author: {
              name: 'Alicia Martinez',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alicia',
            },
            createdAt: new Date(2024, 2, 28),
            tags: ['Goals', 'KPIs'],
            featured: false,
          },
          {
            id: '4',
            title: 'McKinsey Strategic Thinking Article',
            description: 'External resource on strategic thinking frameworks from McKinsey',
            type: 'link',
            url: 'https://www.mckinsey.com/business-functions/strategy-and-corporate-finance/our-insights',
            author: {
              name: 'Robert Wilson',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
            },
            createdAt: new Date(2024, 2, 15),
            tags: ['External', 'Research'],
            featured: false,
          },
          {
            id: '5',
            title: 'Q4 Strategy Presentation',
            description: 'Executive presentation on Q4 strategic initiatives and outcomes',
            type: 'presentation',
            url: '#',
            author: {
              name: 'Emily Wong',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily',
            },
            createdAt: new Date(2024, 1, 10),
            tags: ['Presentation', 'Executive'],
            featured: false,
          },
        ];
        
        setResources(mockResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  const handleAddResource = () => {
    // Validate form
    if (!newResource.title || !newResource.url) {
      toast.error('Please provide at least a title and URL');
      return;
    }
    
    // Create new resource
    const resource: Resource = {
      id: Date.now().toString(),
      title: newResource.title,
      description: newResource.description,
      type: newResource.type as any,
      url: newResource.url,
      author: {
        name: 'Current User',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user',
      },
      createdAt: new Date(),
      tags: newResource.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      featured: false,
    };
    
    setResources([resource, ...resources]);
    setShowAddResourceDialog(false);
    setNewResource({
      title: '',
      description: '',
      type: 'document',
      url: '',
      tags: '',
    });
    
    toast.success('Resource added successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-10 w-10 text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-10 w-10 text-green-500" />;
      case 'presentation':
        return <FileCog className="h-10 w-10 text-amber-500" />;
      case 'link':
        return <Link2 className="h-10 w-10 text-purple-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <PageLayout
      title="Strategic Resources"
      subtitle="Access and manage strategic planning documents and resources"
      icon={<FileCog className="h-6 w-6" />}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Resource Library</h2>
          <p className="text-muted-foreground">Access key strategic documents and resources</p>
        </div>
        <Button onClick={() => setShowAddResourceDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
          <TabsTrigger value="links">External Links</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {loading ? (
            <ResourceListSkeleton />
          ) : (
            <div className="space-y-4">
              {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents">
          {loading ? (
            <ResourceListSkeleton />
          ) : (
            <div className="space-y-4">
              {resources
                .filter(r => r.type === 'document')
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="spreadsheets">
          {loading ? (
            <ResourceListSkeleton />
          ) : (
            <div className="space-y-4">
              {resources
                .filter(r => r.type === 'spreadsheet')
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="links">
          {loading ? (
            <ResourceListSkeleton />
          ) : (
            <div className="space-y-4">
              {resources
                .filter(r => r.type === 'link')
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="featured">
          {loading ? (
            <ResourceListSkeleton />
          ) : (
            <div className="space-y-4">
              {resources
                .filter(r => r.featured)
                .map(resource => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showAddResourceDialog} onOpenChange={setShowAddResourceDialog}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
            <DialogDescription>
              Add a document, spreadsheet, or external link to the resource library.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Strategic Framework Document"
                value={newResource.title}
                onChange={(e) => setNewResource({...newResource, title: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the resource"
                value={newResource.description}
                onChange={(e) => setNewResource({...newResource, description: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Resource Type</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newResource.type}
                onChange={(e) => setNewResource({...newResource, type: e.target.value})}
              >
                <option value="document">Document</option>
                <option value="spreadsheet">Spreadsheet</option>
                <option value="presentation">Presentation</option>
                <option value="link">External Link</option>
              </select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                placeholder="https://example.com/document"
                value={newResource.url}
                onChange={(e) => setNewResource({...newResource, url: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="Strategy, Planning, Framework"
                value={newResource.tags}
                onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddResourceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddResource}>
              Add Resource
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

const ResourceCard: React.FC<{ resource: Resource }> = ({ resource }) => {
  const { title, description, type, url, author, createdAt, tags } = resource;
  
  const handleDownload = () => {
    toast.info('Downloading resource...');
    setTimeout(() => {
      toast.success('Download complete');
    }, 1500);
  };

  const handleOpen = () => {
    if (type === 'link') {
      window.open(url, '_blank');
    } else {
      toast.info('Opening resource...');
    }
  };
  
  return (
    <div className="flex p-4 border rounded-lg">
      <div className="mr-4 flex-shrink-0">
        {getTypeIcon(type)}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium">{title}</h3>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">...</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                Open
              </DropdownMenuItem>
              {type !== 'link' && (
                <DropdownMenuItem onClick={handleDownload}>
                  Download
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map(tag => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            Added by {author.name} • {format(createdAt, 'MMM d, yyyy')}
          </div>
          
          <div className="flex gap-2">
            {type === 'link' ? (
              <Button size="sm" variant="outline" onClick={handleOpen}>
                Visit <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={handleOpen}>
                  Open
                </Button>
                <Button size="sm" variant="outline" onClick={handleDownload}>
                  <Download className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
