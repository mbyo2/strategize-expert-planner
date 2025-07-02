
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const AdvancedSecuritySection: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Security Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">IP Restrictions</h3>
              <p className="text-sm text-muted-foreground">
                Restrict access to specific IP addresses
              </p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Session Timeout</h3>
              <p className="text-sm text-muted-foreground">
                Automatically sign out inactive sessions
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Login Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Email notifications for new sign-ins
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Data Export</h3>
              <p className="text-sm text-muted-foreground">
                Download your account data
              </p>
            </div>
            <Button variant="outline">
              Export Data
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Account Deletion</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account
              </p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedSecuritySection;
