import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Users, Clock, Star, Plus } from "lucide-react";
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
}

interface Message {
  id: string;
  content: string;
  author: TeamMember;
  timestamp: string;
  type: 'text' | 'file' | 'system';
  reactions?: { emoji: string; users: string[] }[];
}

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee: TeamMember;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
}

export default function EnhancedTeamCollaboration() {
  const { currentUser: user } = useSimpleAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'members'>('chat');
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');

  useEffect(() => {
    // Initialize with sample data - in real app, fetch from API
    setTeamMembers([
      {
        id: '1',
        name: 'Alice Johnson',
        email: 'alice@company.com',
        avatar: undefined,
        role: 'Team Lead',
        status: 'online',
        lastActive: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Bob Smith',
        email: 'bob@company.com',
        avatar: undefined,
        role: 'Developer',
        status: 'online',
        lastActive: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: '3',
        name: 'Carol Williams',
        email: 'carol@company.com',
        avatar: undefined,
        role: 'Designer',
        status: 'away',
        lastActive: new Date(Date.now() - 1800000).toISOString()
      }
    ]);

    setMessages([
      {
        id: '1',
        content: 'Welcome to the team collaboration space! 🎉',
        author: teamMembers[0] || {
          id: '1',
          name: 'System',
          email: 'system@company.com',
          role: 'System',
          status: 'online'
        },
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: 'system'
      }
    ]);

    setTasks([
      {
        id: '1',
        title: 'Review quarterly strategy document',
        description: 'Complete review of Q4 strategic planning document',
        assignee: teamMembers[0] || {
          id: '1',
          name: 'Alice Johnson',
          email: 'alice@company.com',
          role: 'Team Lead',
          status: 'online'
        },
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  }, []);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      author: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: 'online'
      },
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    toast.success('Message sent');
  };

  const createTask = () => {
    if (!newTaskTitle.trim() || !selectedAssignee) return;

    const assignee = teamMembers.find(m => m.id === selectedAssignee);
    if (!assignee) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      assignee,
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [...prev, task]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setSelectedAssignee('');
    toast.success('Task created');
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
    toast.success('Task updated');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusBadge = (status: Task['status']) => {
    const variants = {
      'todo': 'secondary',
      'in-progress': 'default',
      'completed': 'default'
    } as const;
    
    return (
      <Badge variant={variants[status]}>
        {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    const colors = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={colors[priority]}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Collaboration</h2>
          <p className="text-muted-foreground">
            Connect, communicate, and collaborate with your team
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {teamMembers.filter(m => m.status === 'online').length} online
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2">
        {[
          { id: 'chat', label: 'Team Chat', icon: MessageSquare },
          { id: 'tasks', label: 'Tasks', icon: Star },
          { id: 'members', label: 'Members', icon: Users }
        ].map(tab => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab.id as any)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Chat Tab */}
      {activeTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Team Chat</CardTitle>
                <CardDescription>
                  Real-time communication with your team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {messages.map(message => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={message.author.avatar} />
                        <AvatarFallback>
                          {message.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{message.author.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Online Members Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Online Now</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.filter(m => m.status === 'online').map(member => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Task</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Task description (optional)"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
              />
              <Button onClick={createTask} disabled={!newTaskTitle.trim() || !selectedAssignee}>
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['todo', 'in-progress', 'completed'].map(status => (
              <div key={status}>
                <h3 className="font-semibold mb-3 capitalize">
                  {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
                </h3>
                <div className="space-y-3">
                  {tasks.filter(task => task.status === status).map(task => (
                    <Card key={task.id}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{task.title}</h4>
                            {getPriorityBadge(task.priority)}
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar} />
                              <AvatarFallback className="text-xs">
                                {task.assignee.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex gap-1">
                            {['todo', 'in-progress', 'completed'].map(newStatus => (
                              <Button
                                key={newStatus}
                                variant={task.status === newStatus ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateTaskStatus(task.id, newStatus as Task['status'])}
                              >
                                {getTaskStatusBadge(newStatus as Task['status']).props.children}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => (
            <Card key={member.id}>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                <p className="text-xs text-muted-foreground mb-3">{member.email}</p>
                <Badge variant="outline" className="capitalize">
                  {member.status}
                </Badge>
                {member.lastActive && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last active: {new Date(member.lastActive).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}