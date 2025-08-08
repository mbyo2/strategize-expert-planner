import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, Pill, FlaskConical, Shield, FileText, Calendar } from 'lucide-react';

export const HealthcareIndustry: React.FC = () => {
  const overview = {
    patientsToday: 128,
    appointments: 342,
    labOrders: 87,
    compliance: 'HIPAA'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Healthcare Industry Suite</h2>
        <Button>
          <Calendar className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Patients Today</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{overview.patientsToday}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Appointments</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{overview.appointments}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Lab Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{overview.labOrders}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Compliance</CardTitle></CardHeader><CardContent><Badge variant="outline">{overview.compliance}</Badge></CardContent></Card>
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="lab">Laboratory</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <Card>
            <CardHeader>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>Registration, scheduling, and EHR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">EHR integration coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Claims</CardTitle>
              <CardDescription>Insurance claims and revenue cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Claim Submission','Payment Posting','Denial Management'].map((f)=> (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Configured</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacy">
          <Card>
            <CardHeader>
              <CardTitle>Pharmacy Management</CardTitle>
              <CardDescription>Inventory, dispensing, prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Medication tracking coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory</CardTitle>
              <CardDescription>Orders, results, and device integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Analyzer integrations coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>Security, privacy, and auditing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Shield className="w-6 h-6 mb-2" /><span>HIPAA Controls</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Stethoscope className="w-6 h-6 mb-2" /><span>HIS Settings</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Pill className="w-6 h-6 mb-2" /><span>Drug Safety</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthcareIndustry;
