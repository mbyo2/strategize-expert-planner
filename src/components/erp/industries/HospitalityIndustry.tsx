import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bed, ClipboardList, CalendarCheck, Building2 } from 'lucide-react';

const HospitalityIndustry: React.FC = () => {
  return (
    <section aria-labelledby="hospitality-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="hospitality-erp-heading" className="text-2xl font-bold">Hospitality Suite</h2>
          <p className="text-muted-foreground">
            Manage reservations, rooms, housekeeping, events, and guest experience
          </p>
        </div>
        <Button variant="default" size="sm">
          <CalendarCheck className="mr-2 h-4 w-4" /> New Reservation
        </Button>
      </header>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Occupancy Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <Bed className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily Rate</p>
                <p className="text-2xl font-bold">$142</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">RevPAR</p>
                <p className="text-2xl font-bold">$111</p>
              </div>
              <ClipboardList className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Events</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <CalendarCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sections */}
      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="guest">Guest Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations">
          <Card>
            <CardHeader>
              <CardTitle>Reservations</CardTitle>
              <CardDescription>Channels, availability, and rates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Manage OTA channels, rate plans, and availability rules.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="housekeeping">
          <Card>
            <CardHeader>
              <CardTitle>Housekeeping</CardTitle>
              <CardDescription>Tasks, inspections, and turnaround</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Create task boards and track room readiness in real time.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle>Rooms & Inventory</CardTitle>
              <CardDescription>Types, maintenance, and allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Monitor room status and schedule preventative maintenance.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader>
              <CardTitle>Events & Banquets</CardTitle>
              <CardDescription>Bookings, layouts, and catering</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Plan event spaces, layouts, and catering packages.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guest">
          <Card>
            <CardHeader>
              <CardTitle>Guest Experience</CardTitle>
              <CardDescription>Feedback, loyalty, and upsell</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Collect feedback, manage loyalty, and personalize offers.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
};

export default HospitalityIndustry;
