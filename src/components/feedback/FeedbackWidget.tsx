
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  AlertCircle, 
  Lightbulb, 
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logAuditEvent } from "@/services/auditService";
import { useLocalStorage } from '@/hooks/use-local-storage';

interface FeedbackWidgetProps {
  position?: 'left' | 'right';
  className?: string;
}

type FeedbackType = 'praise' | 'issue' | 'suggestion' | null;

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ 
  position = 'right',
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useLocalStorage('feedback-submitted', false);
  
  const handleSubmit = async () => {
    if (!feedbackText.trim() || !feedbackType) return;
    
    setSubmitting(true);
    
    try {
      // Log the feedback event
      await logAuditEvent({
        action: 'feedback_submitted',
        resource: 'feedback',
        description: `Feedback type: ${feedbackType}, Content: ${feedbackText}`,
        severity: 'low',
      });
      
      // In a real app, you would send this to your feedback endpoint
      console.log('Feedback submitted:', { type: feedbackType, text: feedbackText });
      
      // Show success state
      setSuccess(true);
      setFeedbackSubmitted(true);
      
      // Reset after delay
      setTimeout(() => {
        setIsOpen(false);
        
        // Reset form after sheet closes
        setTimeout(() => {
          setSuccess(false);
          setFeedbackType(null);
          setFeedbackText('');
        }, 300);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const feedbackOptions = [
    { value: 'praise', label: 'Praise', icon: <ThumbsUp className="h-4 w-4" /> },
    { value: 'issue', label: 'Report Issue', icon: <AlertCircle className="h-4 w-4" /> },
    { value: 'suggestion', label: 'Suggestion', icon: <Lightbulb className="h-4 w-4" /> },
  ];
  
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "fixed bottom-20 z-50 gap-2 hover:bg-primary hover:text-primary-foreground",
            position === 'right' ? 'right-4' : 'left-4',
            className
          )}
          onClick={() => setIsOpen(true)}
          aria-label="Provide feedback"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-flex">Feedback</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Share your feedback
          </SheetTitle>
        </SheetHeader>
        
        {success ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Thank you for your feedback!</h3>
            <p className="text-muted-foreground">
              Your input helps us improve the platform for everyone.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-6">
            <div className="space-y-3">
              <Label>What kind of feedback do you have?</Label>
              <RadioGroup 
                value={feedbackType || ''} 
                onValueChange={(value) => setFeedbackType(value as FeedbackType)}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {feedbackOptions.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option.value} 
                        id={`feedback-type-${option.value}`} 
                        className="sr-only"
                      />
                      <Label
                        htmlFor={`feedback-type-${option.value}`}
                        className={cn(
                          "flex flex-1 items-center justify-center gap-2 rounded-md border border-muted py-3 px-4 cursor-pointer hover:bg-muted/50",
                          feedbackType === option.value && "border-primary bg-primary/10"
                        )}
                      >
                        {option.icon}
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="feedback-text">Tell us more</Label>
              <Textarea
                id="feedback-text"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Share your experience, report a bug, or suggest an improvement..."
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={handleSubmit} 
              disabled={!feedbackText.trim() || !feedbackType || submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit feedback'}
            </Button>
            
            <p className="text-xs text-muted-foreground text-center">
              Your feedback is anonymous unless you include your contact information.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default FeedbackWidget;
