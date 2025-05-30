
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MessageCircle, Star, Send } from 'lucide-react';
import { toast } from 'sonner';

interface FeedbackWidgetProps {
  position?: 'left' | 'right';
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!feedbackType || !message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Here you would typically send the feedback to your backend
    toast.success('Feedback submitted', {
      description: 'Thank you for your feedback! We\'ll review it shortly.'
    });

    // Reset form
    setRating('');
    setFeedbackType('');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`fixed bottom-32 ${position}-4 z-50 gap-2 hover:bg-primary hover:text-primary-foreground`}
          aria-label="Give feedback"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="sr-only md:not-sr-only md:inline-flex">Feedback</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Share Your Feedback
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div>
              <Label className="text-sm font-medium">How would you rate your experience?</Label>
              <RadioGroup value={rating} onValueChange={setRating} className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="flex items-center space-x-1">
                    <RadioGroupItem value={star.toString()} id={`star-${star}`} className="sr-only" />
                    <Label htmlFor={`star-${star}`} className="cursor-pointer">
                      <Star 
                        className={`h-6 w-6 ${
                          rating && parseInt(rating) >= star 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium">Feedback Type *</Label>
              <RadioGroup value={feedbackType} onValueChange={setFeedbackType} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bug" id="bug" />
                  <Label htmlFor="bug" className="text-sm">Bug Report</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="feature" id="feature" />
                  <Label htmlFor="feature" className="text-sm">Feature Request</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="improvement" id="improvement" />
                  <Label htmlFor="improvement" className="text-sm">Improvement Suggestion</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="accessibility" id="accessibility" />
                  <Label htmlFor="accessibility" className="text-sm">Accessibility Issue</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="text-sm">Other</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="message" className="text-sm font-medium">Your Message *</Label>
              <Textarea
                id="message"
                placeholder="Please describe your feedback in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 min-h-[100px]"
              />
            </div>

            <Button onClick={handleSubmit} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Feedback
            </Button>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackWidget;
