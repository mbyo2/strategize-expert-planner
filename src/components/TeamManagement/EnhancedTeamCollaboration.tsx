import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, Users, Clock, Star, Plus, Settings, UserPlus, Loader2 } from "lucide-react";
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import { 
  TeamCollaborationService, 
  type Team, 
  type TeamMember, 
  type TeamMessage, 
  type TeamTask 
} from '@/services/teamCollaborationService';
import { RolePermissionService } from '@/services/rolePermissionService';

interface EnhancedTeamCollaborationProps {
  teamId?: string;
}

export default function EnhancedTeamCollaboration({ teamId = '1' }: EnhancedTeamCollaborationProps) {
  const { session } = useSimpleAuth();
  const user = session.user;
  
  // State management
  const [activeTab, setActiveTab] = useState<'chat' | 'tasks' | 'members'>('chat');
  const [loading, setLoading] = useState(false);
  
  // Team data
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  
  // Form inputs
  const [newMessage, setNewMessage] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  
  // Permissions
  const [userPermissions, setUserPermissions] = useState({
    canManageTeam: false,
    canCreateTasks: false,
    canSendMessages: true,
    userRole: 'member' as string
  });

  // Load team data
  const loadTeamData = useCallback(async () => {
    if (!user || !teamId) return;
    
    setLoading(true);
    try {
      // Load team members
      const members = await TeamCollaborationService.getTeamMembers(teamId);
      setTeamMembers(members);

      // Load messages
      const teamMessages = await TeamCollaborationService.getTeamMessages(teamId);
      setMessages(teamMessages);

      // Load tasks
      const teamTasks = await TeamCollaborationService.getTeamTasks(teamId);
      setTasks(teamTasks);

      // Load permissions
      const canManageTeam = await RolePermissionService.canManageTeamMembers(teamId);
      const canCreateTasks = await RolePermissionService.canCreateTeamTasks(teamId);
      const userRole = await RolePermissionService.getTeamRole(teamId);
      
      setUserPermissions({
        canManageTeam,
        canCreateTasks,
        canSendMessages: !!userRole,
        userRole: userRole || 'member'
      });

    } catch (error) {
      console.error('Error loading team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  }, [user, teamId]);

  // Real-time subscriptions
  useEffect(() => {
    if (!teamId) return;

    const messagesSub = TeamCollaborationService.subscribeToTeamMessages(teamId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    const tasksSub = TeamCollaborationService.subscribeToTeamTasks(teamId, (updatedTask, event) => {
      setTasks(prev => {
        if (event === 'INSERT') {
          return [...prev, updatedTask];
        } else if (event === 'UPDATE') {
          return prev.map(task => task.id === updatedTask.id ? updatedTask : task);
        } else if (event === 'DELETE') {
          return prev.filter(task => task.id !== updatedTask.id);
        }
        return prev;
      });
    });

    return () => {
      messagesSub.unsubscribe();
      tasksSub.unsubscribe();
    };
  }, [teamId]);

  // Load data on mount
  useEffect(() => {
    loadTeamData();
  }, [loadTeamData]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !userPermissions.canSendMessages) return;

    try {
      setNewMessage('');
      await TeamCollaborationService.sendMessage(teamId, newMessage);
      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setNewMessage(newMessage); // Restore message on error
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim() || !userPermissions.canCreateTasks) return;

    try {
      await TeamCollaborationService.createTask(
        teamId,
        newTaskTitle,
        newTaskDescription || undefined,
        selectedAssignee || undefined
      );
      
      setNewTaskTitle('');
      setNewTaskDescription('');
      setSelectedAssignee('');
      toast.success('Task created');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      await TeamCollaborationService.updateTaskStatus(taskId, status);
      toast.success('Task updated');
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTaskStatusBadge = (status: string) => {
    const variants = {
      'todo': 'secondary',
      'in-progress': 'default',
      'completed': 'default'
    } as const;
    
    const statusKey = status as keyof typeof variants;
    
    return (
      <Badge variant={variants[statusKey] || 'secondary'}>
        {status === 'todo' ? 'To Do' : status === 'in-progress' ? 'In Progress' : 'Completed'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      'low': 'bg-blue-100 text-blue-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    
    type PriorityKey = keyof typeof colors;
    const priorityKey = priority as PriorityKey;
    
    return (
      <Badge className={colors[priorityKey] || colors.medium}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    );
  };

  const getOnlineMembers = () => {
    return teamMembers.filter(m => m.status === 'active');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Collaboration</h2>
          <p className="text-muted-foreground">
            Connect, communicate, and collaborate with your team
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">
              {getOnlineMembers().length} online
            </span>
          </div>
          {userPermissions.canManageTeam && (
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
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
                        <AvatarImage src={message.author?.avatar} />
                        <AvatarFallback>
                          {message.author?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {message.author?.name || 'Unknown User'}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(message.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                {userPermissions.canSendMessages && (
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
                )}
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
                  {getOnlineMembers().map(member => (
                    <div key={member.id} className="flex items-center gap-2">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.profile?.avatar} />
                          <AvatarFallback>
                            {member.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(member.status)}`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{member.profile?.name || 'Unknown'}</p>
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
          {userPermissions.canCreateTasks && (
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
                        <SelectItem key={member.id} value={member.user_id}>
                          {member.profile?.name || 'Unknown'}
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
                <Button onClick={createTask} disabled={!newTaskTitle.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          )}

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
                          {task.assignee && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assignee.avatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{task.assignee.name}</span>
                            </div>
                          )}
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                          <div className="flex gap-1">
                            {['todo', 'in-progress', 'completed'].map(newStatus => (
                              <Button
                                key={newStatus}
                                variant={task.status === newStatus ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => updateTaskStatus(task.id, newStatus)}
                              >
                                {getTaskStatusBadge(newStatus).props.children}
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
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Team Members</h3>
            {userPermissions.canManageTeam && (
              <Button variant="outline">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map(member => (
              <Card key={member.id}>
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.profile?.avatar} />
                      <AvatarFallback className="text-lg">
                        {member.profile?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                  </div>
                  <h3 className="font-semibold">{member.profile?.name || 'Unknown'}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{member.role}</p>
                  <p className="text-xs text-muted-foreground mb-3">{member.profile?.email}</p>
                  <Badge variant="outline" className="capitalize">
                    {member.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Joined: {new Date(member.joined_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}