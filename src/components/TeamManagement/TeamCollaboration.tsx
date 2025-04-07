
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Calendar, CheckSquare } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const TeamCollaboration = () => {
  const [activeTab, setActiveTab] = useState('updates');

  // Sample data
  const teamUpdates = [
    { 
      id: 1, 
      user: { name: 'Emily Johnson', avatar: '/placeholder.svg', initials: 'EJ' },
      content: 'Completed the quarterly goals alignment document. Please review when you have a chance.',
      timestamp: '2 hours ago',
      type: 'document'
    },
    { 
      id: 2, 
      user: { name: 'Michael Wong', avatar: '/placeholder.svg', initials: 'MW' },
      content: 'Updated the competitor analysis with new market data from Q2 2023.',
      timestamp: '5 hours ago',
      type: 'update'
    },
    { 
      id: 3, 
      user: { name: 'Sarah Miller', avatar: '/placeholder.svg', initials: 'SM' },
      content: 'Scheduled a strategy review meeting for next Friday at 10 AM. Calendar invites sent.',
      timestamp: 'Yesterday',
      type: 'meeting'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Q3 Strategy Review',
      date: 'Sep 15, 2023',
      time: '10:00 AM - 11:30 AM',
      attendees: [
        { name: 'Emily Johnson', avatar: '/placeholder.svg', initials: 'EJ' },
        { name: 'Michael Wong', avatar: '/placeholder.svg', initials: 'MW' },
        { name: 'Sarah Miller', avatar: '/placeholder.svg', initials: 'SM' },
        { name: 'David Chen', avatar: '/placeholder.svg', initials: 'DC' }
      ]
    },
    {
      id: 2,
      title: 'Market Analysis Discussion',
      date: 'Sep 18, 2023',
      time: '2:00 PM - 3:00 PM',
      attendees: [
        { name: 'Emily Johnson', avatar: '/placeholder.svg', initials: 'EJ' },
        { name: 'Michael Wong', avatar: '/placeholder.svg', initials: 'MW' }
      ]
    }
  ];

  const taskItems = [
    {
      id: 1,
      title: 'Review Q3 strategic initiatives progress',
      assignee: { name: 'Emily Johnson', avatar: '/placeholder.svg', initials: 'EJ' },
      dueDate: 'Sep 12, 2023',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Prepare competitor analysis presentation',
      assignee: { name: 'Michael Wong', avatar: '/placeholder.svg', initials: 'MW' },
      dueDate: 'Sep 14, 2023',
      status: 'in-progress'
    },
    {
      id: 3,
      title: 'Schedule interviews with key market participants',
      assignee: { name: 'Sarah Miller', avatar: '/placeholder.svg', initials: 'SM' },
      dueDate: 'Sep 20, 2023',
      status: 'todo'
    }
  ];

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <div className="p-2 bg-blue-100 rounded-full"><MessageSquare className="h-4 w-4 text-blue-600" /></div>;
      case 'meeting':
        return <div className="p-2 bg-purple-100 rounded-full"><Calendar className="h-4 w-4 text-purple-600" /></div>;
      default:
        return <div className="p-2 bg-green-100 rounded-full"><CheckSquare className="h-4 w-4 text-green-600" /></div>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">In Progress</span>;
      default:
        return <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">To Do</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Team Collaboration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="updates" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="updates">Team Updates</TabsTrigger>
            <TabsTrigger value="meetings">Upcoming Meetings</TabsTrigger>
            <TabsTrigger value="tasks">Task Board</TabsTrigger>
          </TabsList>
          
          <TabsContent value="updates" className="space-y-4">
            {teamUpdates.map(update => (
              <div key={update.id} className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={update.user.avatar} alt={update.user.name} />
                  <AvatarFallback>{update.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{update.user.name}</p>
                    <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700">{update.content}</p>
                </div>
                {getUpdateIcon(update.type)}
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full mt-2">View All Updates</Button>
          </TabsContent>
          
          <TabsContent value="meetings" className="space-y-4">
            {upcomingMeetings.map(meeting => (
              <div key={meeting.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <p className="text-sm text-muted-foreground">{meeting.date} • {meeting.time}</p>
                  </div>
                  <Button size="sm" variant="outline">Join</Button>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm mb-2">Attendees:</p>
                  <div className="flex -space-x-2">
                    {meeting.attendees.map((attendee, i) => (
                      <Avatar key={i} className="border-2 border-background">
                        <AvatarImage src={attendee.avatar} alt={attendee.name} />
                        <AvatarFallback>{attendee.initials}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full mt-2">Schedule Meeting</Button>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            {taskItems.map(task => (
              <div key={task.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{task.title}</h4>
                  {getStatusBadge(task.status)}
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      <AvatarFallback>{task.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{task.assignee.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Due: {task.dueDate}</p>
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full mt-2">Add Task</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TeamCollaboration;
