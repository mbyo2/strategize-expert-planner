
import React, { useState } from 'react';
import { Search, BookOpen, FileText, Video, ExternalLink, Download, Filter, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageLayout from '@/components/PageLayout';
import Header from '@/components/Header';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'template' | 'guide' | 'tool';
  category: 'strategy' | 'planning' | 'analysis' | 'templates' | 'training';
  url?: string;
  downloadUrl?: string;
  featured: boolean;
  lastUpdated: string;
  author: string;
  tags: string[];
  rating: number;
  views: number;
}

const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Strategic Planning Framework Guide',
    description: 'Comprehensive guide for developing and implementing strategic plans across organizations.',
    type: 'document',
    category: 'strategy',
    downloadUrl: '#',
    featured: true,
    lastUpdated: '2024-01-15',
    author: 'Strategy Team',
    tags: ['planning', 'framework', 'strategy'],
    rating: 4.8,
    views: 1250
  },
  {
    id: '2',
    title: 'Market Analysis Template',
    description: 'Excel template for conducting comprehensive market analysis and competitive research.',
    type: 'template',
    category: 'analysis',
    downloadUrl: '#',
    featured: true,
    lastUpdated: '2024-01-10',
    author: 'Analytics Team',
    tags: ['template', 'market', 'analysis'],
    rating: 4.6,
    views: 890
  },
  {
    id: '3',
    title: 'Introduction to Strategic Planning',
    description: 'Video series covering the fundamentals of strategic planning and implementation.',
    type: 'video',
    category: 'training',
    url: '#',
    featured: false,
    lastUpdated: '2024-01-08',
    author: 'Training Department',
    tags: ['training', 'video', 'basics'],
    rating: 4.7,
    views: 2100
  },
  {
    id: '4',
    title: 'SWOT Analysis Tool',
    description: 'Interactive tool for conducting comprehensive SWOT analyses.',
    type: 'tool',
    category: 'analysis',
    url: '#',
    featured: true,
    lastUpdated: '2024-01-12',
    author: 'Product Team',
    tags: ['tool', 'swot', 'analysis'],
    rating: 4.5,
    views: 750
  },
  {
    id: '5',
    title: 'Goal Setting Best Practices',
    description: 'Guide covering SMART goals, OKRs, and other goal-setting methodologies.',
    type: 'guide',
    category: 'planning',
    downloadUrl: '#',
    featured: false,
    lastUpdated: '2024-01-05',
    author: 'Leadership Team',
    tags: ['goals', 'okr', 'smart'],
    rating: 4.4,
    views: 650
  }
];

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'document':
    case 'guide':
      return FileText;
    case 'video':
      return Video;
    case 'template':
      return Download;
    case 'tool':
      return ExternalLink;
    default:
      return BookOpen;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'document':
    case 'guide':
      return 'bg-blue-100 text-blue-800';
    case 'video':
      return 'bg-purple-100 text-purple-800';
    case 'template':
      return 'bg-green-100 text-green-800';
    case 'tool':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'popular':
        return b.views - a.views;
      case 'rating':
        return b.rating - a.rating;
      case 'alphabetical':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const featuredResources = mockResources.filter(resource => resource.featured);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout 
        title="Resource Library" 
        subtitle="Access strategic planning tools, templates, and educational materials"
      >
        <div className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Search Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search resources, templates, guides..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="strategy">Strategy</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="analysis">Analysis</SelectItem>
                      <SelectItem value="templates">Templates</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="document">Documents</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="template">Templates</SelectItem>
                      <SelectItem value="guide">Guides</SelectItem>
                      <SelectItem value="tool">Tools</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="featured">Featured</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 mr-2 text-primary" />
                            <Badge className={getTypeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </div>
                          {resource.featured && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">
                          {resource.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {resource.rating}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(resource.lastUpdated).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {resource.downloadUrl && (
                              <Button size="sm" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {resource.url && (
                              <Button size="sm" variant="outline" className="flex-1">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredResources.map((resource) => {
                  const IconComponent = getResourceIcon(resource.type);
                  return (
                    <Card key={resource.id} className="hover:shadow-lg transition-shadow border-primary/20">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <IconComponent className="h-5 w-5 mr-2 text-primary" />
                            <Badge className={getTypeColor(resource.type)}>
                              {resource.type}
                            </Badge>
                          </div>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4 text-sm">
                          {resource.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {resource.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Star className="h-3 w-3 mr-1 text-yellow-500" />
                              {resource.rating}
                            </div>
                            <div>
                              {resource.views} views
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {resource.downloadUrl && (
                              <Button size="sm" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                            {resource.url && (
                              <Button size="sm" variant="outline" className="flex-1">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </PageLayout>
    </div>
  );
};

export default Resources;
