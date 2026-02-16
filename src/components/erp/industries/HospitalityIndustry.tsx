import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bed, ClipboardList, CalendarCheck, Building2 } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganizations } from '@/hooks/useOrganizations';

const HospitalityIndustry: React.FC = () => {
  const { currentOrganization } = useOrganizations();
  const orgId = currentOrganization?.id || '';
  const { entities: rooms, isLoading: l1 } = useERPEntities(orgId, 'hospitality', 'room');
  const { entities: reservations, isLoading: l2 } = useERPEntities(orgId, 'hospitality', 'reservation');
  const { entities: events, isLoading: l3 } = useERPEntities(orgId, 'hospitality', 'event');
  const isLoading = l1 || l2 || l3;

  const occupiedRooms = rooms.filter((r: any) => r.entity_data?.status === 'occupied').length;
  const occupancyRate = rooms.length > 0 ? Math.round((occupiedRooms / rooms.length) * 100) : 0;
  const avgRate = reservations.length > 0 ? Math.round(reservations.reduce((s: number, r: any) => s + (r.entity_data?.rate || 0), 0) / reservations.length) : 0;
  const revPAR = rooms.length > 0 ? Math.round((avgRate * occupancyRate) / 100) : 0;

  return (
    <section aria-labelledby="hospitality-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="hospitality-erp-heading" className="text-2xl font-bold">Hospitality Suite</h2>
          <p className="text-muted-foreground">Manage reservations, rooms, housekeeping, events, and guest experience</p>
        </div>
        <Button variant="default" size="sm"><CalendarCheck className="mr-2 h-4 w-4" /> New Reservation</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: Bed },
          { label: 'Avg Daily Rate', value: avgRate > 0 ? `$${avgRate}` : '$0', icon: Building2 },
          { label: 'RevPAR', value: `$${revPAR}`, icon: ClipboardList },
          { label: 'Upcoming Events', value: events.length, icon: CalendarCheck },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-2xl font-bold">{value}</p>}
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="reservations">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="housekeeping">Housekeeping</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="guest">Guest Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="reservations"><Card><CardHeader><CardTitle>Reservations</CardTitle><CardDescription>Channels, availability, and rates</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : reservations.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No reservations found.</p> : <p className="text-sm text-muted-foreground">{reservations.length} active reservations.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="housekeeping"><Card><CardHeader><CardTitle>Housekeeping</CardTitle><CardDescription>Tasks, inspections, and turnaround</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Create task boards and track room readiness in real time.</p></CardContent></Card></TabsContent>
        <TabsContent value="rooms"><Card><CardHeader><CardTitle>Rooms & Inventory</CardTitle><CardDescription>Types, maintenance, and allocation</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{rooms.length} rooms managed, {occupiedRooms} currently occupied.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="events"><Card><CardHeader><CardTitle>Events & Banquets</CardTitle><CardDescription>Bookings, layouts, and catering</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{events.length} events scheduled.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="guest"><Card><CardHeader><CardTitle>Guest Experience</CardTitle><CardDescription>Feedback, loyalty, and upsell</CardDescription></CardHeader><CardContent><p className="text-sm text-muted-foreground">Collect feedback, manage loyalty, and personalize offers.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default HospitalityIndustry;