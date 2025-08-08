import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BookOpen, Users, Banknote, ClipboardList, Building2, Home, User } from 'lucide-react';

export const EducationIndustry: React.FC = () => {
  const counts = {
    students: 4820,
    courses: 620,
    faculty: 320,
    dorms: 12
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Education Industry Suite</h2>
        <Button>
          <ClipboardList className="w-4 h-4 mr-2" />
          Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Students</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.students}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Courses</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.courses}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Faculty</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.faculty}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Dormitories</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{counts.dorms}</div></CardContent></Card>
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

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Admissions, enrollment, records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Student portal coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Curriculum and timetables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Curriculum tools coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Fee Management</CardTitle>
              <CardDescription>Billing and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="p-6 h-auto flex-col"><Banknote className="w-6 h-6 mb-2" /><span>Create Invoice</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><User className="w-6 h-6 mb-2" /><span>Student Ledger</span></Button>
                <Button variant="outline" className="p-6 h-auto flex-col"><Building2 className="w-6 h-6 mb-2" /><span>Scholarships</span></Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faculty">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
              <CardDescription>Assignments and evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Evaluation workflows coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lms">
          <Card>
            <CardHeader>
              <CardTitle>LMS Integration</CardTitle>
              <CardDescription>Connect with learning platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">LMS connectors coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alumni">
          <Card>
            <CardHeader>
              <CardTitle>Alumni</CardTitle>
              <CardDescription>Engagement and donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">Alumni CRM coming soon</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationIndustry;
