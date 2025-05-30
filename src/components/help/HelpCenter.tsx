
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Book, MessageSquare, Video, FileText, ExternalLink } from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'article' | 'video' | 'guide' | 'faq';
  popular?: boolean;
}

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpArticles: HelpArticle[] = [
    {
      id: '1',
      title: 'Getting Started with Intantiko',
      description: 'Learn the basics of strategic planning and goal management',
      category: 'Getting Started',
      type: 'guide',
      popular: true
    },
    {
      id: '2',
      title: 'Universal Access Features',
      description: 'Configure accessibility settings for all users',
      category: 'Accessibility',
      type: 'article',
      popular: true
    },
    {
      id: '3',
      title: 'Military/Battlefield Mode',
      description: 'Optimize interface for tactical environments',
      category: 'Accessibility',
      type: 'video'
    },
    {
      id: '4',
      title: 'Data Foundry Setup',
      description: 'Connect and manage your data sources',
      category: 'Data Management',
      type: 'guide'
    },
    {
      id: '5',
      title: 'AI Operations Center',
      description: 'Deploy and monitor AI/ML models',
      category: 'AI/ML',
      type: 'article'
    },
    {
      id: '6',
      title: 'Troubleshooting Common Issues',
      description: 'Solutions to frequently encountered problems',
      category: 'Support',
      type: 'faq',
      popular: true
    }
  ];

  const categories = [
    'all',
    'Getting Started',
    'Accessibility',
    'Data Management',
    'AI/ML',
    'Support'
  ];

  const filteredArticles = helpArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'guide':
        return <Book className="h-4 w-4" />;
      case 'faq':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Help Center</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold">Contact Support</div>
                    <div className="text-sm text-muted-foreground">Get personalized help</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold">Video Tutorials</div>
                    <div className="text-sm text-muted-foreground">Watch step-by-step guides</div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto p-4">
                  <div className="text-left">
                    <div className="font-semibold">Community Forum</div>
                    <div className="text-sm text-muted-foreground">Connect with users</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {searchQuery ? `Search Results (${filteredArticles.length})` : 'Help Articles'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(article.type)}
                        <CardTitle className="text-base">{article.title}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        {article.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs capitalize">
                          {article.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{article.description}</CardDescription>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">{article.category}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No articles found matching your search.</p>
                <Button variant="outline" className="mt-2" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;
