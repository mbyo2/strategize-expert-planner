
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Mail, Send, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  trigger: string;
  enabled: boolean;
}

const EmailNotificationService = () => {
  const [notifications, setNotifications] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Goal Achievement',
      subject: 'Strategic Goal Achieved: {{goal_name}}',
      trigger: 'goal_completed',
      enabled: true
    },
    {
      id: '2', 
      name: 'Strategy Review Due',
      subject: 'Strategy Review Reminder: {{review_title}}',
      trigger: 'review_due_24h',
      enabled: true
    },
    {
      id: '3',
      name: 'Weekly Progress Update',
      subject: 'Weekly Strategic Progress Summary',
      trigger: 'weekly_digest',
      enabled: false
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [testEmail, setTestEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleToggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, enabled: !notification.enabled }
          : notification
      )
    );
    toast.success('Notification setting updated');
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSending(true);
    
    // Simulate sending test email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSending(false);
    toast.success(`Test email sent to ${testEmail}`);
  };

  const getTriggerDisplay = (trigger: string) => {
    switch (trigger) {
      case 'goal_completed': return 'When a goal is completed';
      case 'review_due_24h': return '24 hours before strategy review';
      case 'weekly_digest': return 'Every Monday at 9:00 AM';
      default: return trigger;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Email Notifications</h3>
        <p className="text-muted-foreground">
          Configure automated email notifications for important strategic events
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notification Templates
            </CardTitle>
            <CardDescription>
              Manage which notifications you want to receive via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{notification.name}</h4>
                    <Badge variant={notification.enabled ? "default" : "secondary"}>
                      {notification.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getTriggerDisplay(notification.trigger)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Subject: {notification.subject}
                  </p>
                </div>
                <Switch
                  checked={notification.enabled}
                  onCheckedChange={() => handleToggleNotification(notification.id)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Test Email Notifications
            </CardTitle>
            <CardDescription>
              Send a test email to verify your notification settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="test-email">Email Address</Label>
              <Input
                id="test-email"
                type="email"
                placeholder="your@email.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Notification Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {notifications.filter(n => n.enabled).map((notification) => (
                    <SelectItem key={notification.id} value={notification.id}>
                      {notification.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleSendTestEmail}
              disabled={isSending || !testEmail || !selectedTemplate}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Test Email
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Delivery Status</CardTitle>
          <CardDescription>
            Recent email notification delivery status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { email: 'user@example.com', template: 'Goal Achievement', status: 'delivered', time: '2 hours ago' },
              { email: 'manager@example.com', template: 'Strategy Review Due', status: 'delivered', time: '1 day ago' },
              { email: 'team@example.com', template: 'Weekly Progress Update', status: 'pending', time: '2 days ago' }
            ].map((delivery, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{delivery.email}</p>
                  <p className="text-sm text-muted-foreground">{delivery.template}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {delivery.status === 'delivered' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    <Badge variant={delivery.status === 'delivered' ? 'default' : 'secondary'}>
                      {delivery.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{delivery.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailNotificationService;
