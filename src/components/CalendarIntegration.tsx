
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Download, Plus, Calendar } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarEvent, createCalendarEvent } from '@/utils/calendarUtils';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { logAuditEvent } from '@/services/auditService';

interface CalendarIntegrationProps {
  triggerClassName?: string;
  prefilledEvent?: Partial<CalendarEvent>;
  onEventCreated?: (event: CalendarEvent) => void;
}

const CalendarIntegration: React.FC<CalendarIntegrationProps> = ({
  triggerClassName,
  prefilledEvent,
  onEventCreated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [eventType, setEventType] = useState('review');
  
  // Initialize with prefilled data or defaults
  const [eventData, setEventData] = useState<Partial<CalendarEvent>>({
    title: prefilledEvent?.title || '',
    description: prefilledEvent?.description || '',
    location: prefilledEvent?.location || 'Virtual Meeting',
    startTime: prefilledEvent?.startTime || new Date(),
    endTime: prefilledEvent?.endTime || new Date(Date.now() + 3600000), // 1 hour from now
    attendees: prefilledEvent?.attendees || [],
  });
  
  // Format date for input fields
  const formatDateForInput = (date: Date): string => {
    return date.toISOString().substring(0, 16);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData(prev => ({ ...prev, [name]: new Date(value) }));
  };
  
  const handleAttendeesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const attendees = e.target.value.split('\n').filter(Boolean);
    setEventData(prev => ({ ...prev, attendees }));
  };
  
  const handleEventTypeChange = (value: string) => {
    setEventType(value);
    
    // Set default titles based on event type
    switch (value) {
      case 'review':
        setEventData(prev => ({ 
          ...prev, 
          title: 'Strategic Review Meeting',
          description: 'Quarterly review of strategic goals and initiatives.'
        }));
        break;
      case 'planning':
        setEventData(prev => ({ 
          ...prev, 
          title: 'Strategic Planning Session',
          description: 'Planning session for upcoming quarter strategic initiatives.'
        }));
        break;
      case 'alignment':
        setEventData(prev => ({ 
          ...prev, 
          title: 'Team Alignment Meeting',
          description: 'Alignment session to ensure all team members understand strategic goals and their roles.'
        }));
        break;
      case 'market':
        setEventData(prev => ({ 
          ...prev, 
          title: 'Market Analysis Workshop',
          description: 'Workshop to analyze market trends and competitive landscape.'
        }));
        break;
    }
  };
  
  const handleCreateEvent = () => {
    if (!eventData.title || !eventData.startTime || !eventData.endTime) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Create event ID if not provided
      const event: CalendarEvent = {
        id: eventData.id || uuidv4(),
        title: eventData.title || '',
        description: eventData.description,
        startTime: eventData.startTime || new Date(),
        endTime: eventData.endTime || new Date(),
        location: eventData.location,
        attendees: eventData.attendees,
      };
      
      // Call the callback if provided
      if (onEventCreated) {
        onEventCreated(event);
      }
      
      // Log event creation
      logAuditEvent({
        action: 'create',
        resource: 'event',
        resourceId: event.id,
        description: `Created calendar event: ${event.title}`,
        severity: 'low',
      });
      
      // Create calendar event utilities
      const calendar = createCalendarEvent(event);
      
      // Auto-download ICS file
      calendar.downloadIcs();
      
      toast.success('Event created successfully', {
        description: 'The event has been added to your calendar.',
        action: {
          label: 'Add to Google',
          onClick: () => calendar.addToGoogle(),
        },
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className={triggerClassName}
          onClick={() => setIsOpen(true)}
        >
          <CalendarDays className="h-4 w-4 mr-2" />
          Calendar Integration
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add to Calendar</DialogTitle>
          <DialogDescription>
            Create a calendar event and export it to your preferred calendar service.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Type</label>
            <Select 
              value={eventType} 
              onValueChange={handleEventTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="review">Strategic Review</SelectItem>
                <SelectItem value="planning">Planning Session</SelectItem>
                <SelectItem value="alignment">Team Alignment</SelectItem>
                <SelectItem value="market">Market Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Event Title*</label>
            <Input 
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              placeholder="Event title"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea 
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              placeholder="Event description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Time*</label>
              <Input 
                type="datetime-local"
                name="startTime"
                value={formatDateForInput(eventData.startTime || new Date())}
                onChange={handleDateChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">End Time*</label>
              <Input 
                type="datetime-local"
                name="endTime"
                value={formatDateForInput(eventData.endTime || new Date(Date.now() + 3600000))}
                onChange={handleDateChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input 
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              placeholder="Event location or meeting link"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Attendees (one per line)</label>
            <Textarea 
              placeholder="Enter email addresses, one per line"
              rows={3}
              value={eventData.attendees?.join('\n')}
              onChange={handleAttendeesChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between w-full">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="default"
                onClick={handleCreateEvent}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Create & Download
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarIntegration;
