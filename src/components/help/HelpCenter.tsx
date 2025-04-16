
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, FileText, MessageCircle, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const faqData = [
  {
    question: "How do I create a new strategic goal?",
    answer: "Navigate to the Goals page, then click the 'Add Goal' button in the top right corner. Fill in the required information in the form and click 'Save'. Your new goal will be added to your dashboard."
  },
  {
    question: "What are the different user roles?",
    answer: "The system has four main roles: Viewer (basic access to view dashboards), Analyst (can analyze data and create reports), Manager (can manage teams and create plans), and Admin (has full system access)."
  },
  {
    question: "How can I share a report with my team?",
    answer: "Open the report you want to share, then click the 'Share' button. You can enter your team members' emails or select from existing users. You can also set permission levels for each recipient."
  },
  {
    question: "How do I set up notifications?",
    answer: "Go to your Profile page by clicking your avatar in the top right corner, then select 'Settings'. Navigate to the 'Notifications' tab where you can customize which notifications you receive and how you receive them."
  },
  {
    question: "How can I export data from the platform?",
    answer: "Most data tables and reports have an 'Export' button (usually displayed as a download icon). Click this button and select your preferred format (CSV, Excel, PDF)."
  },
  {
    question: "What happens if I forget my password?",
    answer: "On the login page, click the 'Forgot Password' link. Enter the email associated with your account, and you'll receive instructions to reset your password."
  },
  {
    question: "Can I customize my dashboard?",
    answer: "Yes! From the main dashboard, click the 'Customize' button in the top right corner. You can then add, remove, or rearrange widgets to suit your needs."
  },
  {
    question: "How do I integrate with other tools?",
    answer: "Go to Settings > Integrations. You'll see a list of available integrations. Click 'Connect' next to the tool you want to integrate with and follow the authentication steps."
  }
];

const articleSections = [
  {
    title: "Getting Started",
    articles: [
      { id: "gs1", title: "Platform Overview", content: "A comprehensive overview of the platform and its features." },
      { id: "gs2", title: "First Steps Guide", content: "Learn how to get started with your strategic planning." },
      { id: "gs3", title: "Understanding Your Dashboard", content: "Learn about each component on your dashboard." }
    ]
  },
  {
    title: "Strategic Planning",
    articles: [
      { id: "sp1", title: "Creating Effective Goals", content: "Best practices for setting strategic goals that drive results." },
      { id: "sp2", title: "Industry Analysis Tools", content: "How to use the platform's industry analysis features." },
      { id: "sp3", title: "Collaboration Features", content: "Ways to collaborate with your team on strategic initiatives." }
    ]
  },
  {
    title: "Advanced Features",
    articles: [
      { id: "af1", title: "Custom Reporting", content: "How to create and customize reports." },
      { id: "af2", title: "Data Visualization", content: "Making the most of the platform's visualization tools." },
      { id: "af3", title: "Automation and Alerts", content: "Setting up automated workflows and alerts." }
    ]
  }
];

const HelpCenter: React.FC<HelpCenterProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useLocalStorage('helpCenter-activeTab', 'faq');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const filteredFaqs = faqData.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredArticles = articleSections.map(section => ({
    ...section,
    articles: section.articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.articles.length > 0);

  const showArticle = (articleId: string) => {
    setSelectedArticle(articleId);
  };
  
  const backToArticlesList = () => {
    setSelectedArticle(null);
  };

  // Feedback handling
  const [feedbackType, setFeedbackType] = useState<'positive' | 'negative' | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
  const submitFeedback = () => {
    // In a real app, this would send feedback to a backend service
    console.log("Feedback submitted:", { type: feedbackType, text: feedbackText });
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText('');
      setFeedbackType(null);
    }, 3000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] h-[600px] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-primary" />
            Help Center
          </DialogTitle>
          <div className="relative mt-4">
            <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="mx-6 justify-start border-b rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="faq" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
            >
              <FileText className="h-4 w-4 mr-2" />
              Articles
            </TabsTrigger>
            <TabsTrigger 
              value="feedback" 
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none px-4 py-2"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Feedback
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-[calc(100%-1rem)] px-6 pb-4">
              {searchQuery && filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No FAQs match your search criteria</p>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="articles" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-[calc(100%-1rem)] px-6 pb-4">
              {selectedArticle ? (
                <div>
                  <Button variant="ghost" size="sm" onClick={backToArticlesList} className="mb-4">
                    ← Back to Articles
                  </Button>
                  
                  {articleSections.flatMap(section => 
                    section.articles.filter(article => article.id === selectedArticle)
                  ).map(article => (
                    <div key={article.id} className="space-y-4">
                      <h3 className="text-xl font-semibold">{article.title}</h3>
                      <p className="text-muted-foreground">{article.content}</p>
                      {/* This would contain the full article content in a real app */}
                      <p className="text-muted-foreground">
                        This is a placeholder for the full article content. In a real application, 
                        this would contain comprehensive documentation with images, links, and 
                        formatted text to guide users through the feature or concept.
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {searchQuery && filteredArticles.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No articles match your search criteria</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {filteredArticles.map(section => (
                        <div key={section.title} className="space-y-3">
                          <h3 className="font-semibold text-lg">{section.title}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {section.articles.map(article => (
                              <div 
                                key={article.id}
                                className="p-3 border rounded-md hover:bg-muted cursor-pointer"
                                onClick={() => showArticle(article.id)}
                              >
                                <h4 className="font-medium">{article.title}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{article.content}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="feedback" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-[calc(100%-1rem)] px-6 pb-4">
              <div className="space-y-6 py-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">How was your experience?</h3>
                  <p className="text-muted-foreground mb-4">Your feedback helps us improve our help center</p>
                  
                  <div className="flex gap-3 mb-6">
                    <Button 
                      variant={feedbackType === 'positive' ? 'default' : 'outline'} 
                      className="flex-1"
                      onClick={() => setFeedbackType('positive')}
                    >
                      👍 Helpful
                    </Button>
                    <Button 
                      variant={feedbackType === 'negative' ? 'default' : 'outline'}
                      className="flex-1"
                      onClick={() => setFeedbackType('negative')}
                    >
                      👎 Not Helpful
                    </Button>
                  </div>
                </div>
                
                {feedbackType && (
                  <div className="space-y-4 animate-fade-in">
                    <h4 className="font-medium">
                      {feedbackType === 'positive' 
                        ? 'Thanks! Anything specific you liked?' 
                        : 'We\'re sorry. What can we improve?'}
                    </h4>
                    <textarea 
                      className="w-full p-3 h-24 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Share your thoughts..."
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <Button onClick={submitFeedback} disabled={feedbackSubmitted}>
                      {feedbackSubmitted ? 'Thank you!' : 'Submit Feedback'}
                    </Button>
                  </div>
                )}
                
                <div className="mt-10 p-4 bg-muted/50 rounded-lg border flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium mb-1">Need more help?</h4>
                    <p className="text-sm text-muted-foreground">
                      For more detailed assistance, you can contact our support team directly at 
                      <a href="mailto:support@intantiko.com" className="text-primary hover:underline"> support@intantiko.com</a>.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default HelpCenter;
