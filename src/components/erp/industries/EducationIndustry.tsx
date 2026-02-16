import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ClipboardList, Banknote, Building2, User } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

export const EducationIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: students, isLoading: l1 } = useERPEntities(orgId, 'education', 'student');
  const { entities: courses, isLoading: l2 } = useERPEntities(orgId, 'education', 'course');
  const { entities: faculty, isLoading: l3 } = useERPEntities(orgId, 'education', 'faculty');
  const { entities: facilities, isLoading: l4 } = useERPEntities(orgId, 'education', 'facility');
  const isLoading = l1 || l2 || l3 || l4;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education Industry Suite</h2>
        <Button><ClipboardList className="w-4 h-4 mr-2" />Create Course</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Students', value: students.length },
          { label: 'Courses', value: courses.length },
          { label: 'Faculty', value: faculty.length },
          { label: 'Facilities', value: facilities.length },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{label}</CardTitle></CardHeader>
            <CardContent>{isLoading ? <Skeleton className="h-8 w-16" /> : <div className="text-2xl font-bold">{value}</div>}</CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="students">
        <TabsList>
          <TabsTrigger value="students">Student Info</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="fees">Fees</TabsTrigger>
          <TabsTrigger value="faculty">Faculty</TabsTrigger>
          <TabsTrigger value="lms">LMS</TabsTrigger>
          <TabsTrigger value="alumni">Alumni</TabsTrigger>
        </TabsList>

        <TabsContent value="students"><Card><CardHeader><CardTitle>Student Information</CardTitle><CardDescription>Admissions, enrollment, records</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : students.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No students found.</p> : <p className="text-sm text-muted-foreground">{students.length} students enrolled.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="courses"><Card><CardHeader><CardTitle>Course Management</CardTitle><CardDescription>Curriculum and timetables</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{courses.length} courses available.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="fees">
          <Card><CardHeader><CardTitle>Fee Management</CardTitle><CardDescription>Billing and payments</CardDescription></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Banknote className="w-6 h-6 mb-2" /><span>Create Invoice</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><User className="w-6 h-6 mb-2" /><span>Student Ledger</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Building2 className="w-6 h-6 mb-2" /><span>Scholarships</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty"><Card><CardHeader><CardTitle>Faculty Management</CardTitle><CardDescription>Assignments and evaluations</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{faculty.length} faculty members.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="lms"><Card><CardHeader><CardTitle>LMS Integration</CardTitle><CardDescription>Connect with learning platforms</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">LMS connectors coming soon</p></CardContent></Card></TabsContent>
        <TabsContent value="alumni"><Card><CardHeader><CardTitle>Alumni</CardTitle><CardDescription>Engagement and donations</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Alumni CRM coming soon</p></CardContent></Card></TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationIndustry;