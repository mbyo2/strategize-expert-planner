import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Stethoscope, Pill, Shield, FileText, Calendar } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const HealthcareIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: patients, isLoading: l1 } = useERPEntities(orgId, 'healthcare', 'patient');
  const { entities: appointments, isLoading: l2 } = useERPEntities(orgId, 'healthcare', 'appointment');
  const { entities: labOrders, isLoading: l3 } = useERPEntities(orgId, 'healthcare', 'lab_order');
  const isLoading = l1 || l2 || l3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Healthcare Industry Suite</h2>
        <Button><Calendar className="w-4 h-4 mr-2" />New Appointment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Patients', value: patients.length },
          { label: 'Appointments', value: appointments.length },
          { label: 'Lab Orders', value: labOrders.length },
          { label: 'Compliance', value: 'HIPAA', isBadge: true },
        ].map(({ label, value, isBadge }) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : isBadge ? <Badge variant="outline">{value}</Badge> : <div className="text-2xl font-bold">{value}</div>}</CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="patients">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="pharmacy">Pharmacy</TabsTrigger>
          <TabsTrigger value="lab">Laboratory</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="patients"><Card><CardHeader><CardTitle>Patient Management</CardTitle><CardDescription>Registration, scheduling, and EHR</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : patients.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No patients found.</p> : <p className="text-sm text-muted-foreground">{patients.length} patients in system.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="billing">
          <Card><CardHeader><CardTitle>Billing & Claims</CardTitle><CardDescription>Insurance claims and revenue cycle</CardDescription></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {['Claim Submission', 'Payment Posting', 'Denial Management'].map((f) => (
                  <div key={f} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-2"><FileText className="w-4 h-4" /><span>{f}</span></div>
                    <Badge variant="outline">Configured</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pharmacy"><Card><CardHeader><CardTitle>Pharmacy Management</CardTitle><CardDescription>Inventory, dispensing, prescriptions</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Medication tracking coming soon</p></CardContent></Card></TabsContent>
        <TabsContent value="lab"><Card><CardHeader><CardTitle>Laboratory</CardTitle><CardDescription>Orders, results, and device integrations</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{labOrders.length} lab orders tracked.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="compliance">
          <Card><CardHeader><CardTitle>Compliance Management</CardTitle><CardDescription>Security, privacy, and auditing</CardDescription></CardHeader>
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