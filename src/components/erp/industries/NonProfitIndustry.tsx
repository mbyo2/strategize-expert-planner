import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HeartHandshake, Gift, Users, Megaphone } from 'lucide-react';
import { useERPEntities } from '@/hooks/useERP';
import { useOrganization } from '@/contexts/OrganizationContext';
import IndustryStarterPanel from './IndustryStarterPanel';

const NonProfitIndustry: React.FC = () => {
  const { organizationId } = useOrganization();
  const orgId = organizationId || '';
  const { entities: donors, isLoading: l1 } = useERPEntities(orgId, 'nonprofit', 'donor');
  const { entities: grants, isLoading: l2 } = useERPEntities(orgId, 'nonprofit', 'grant');
  const { entities: programs, isLoading: l3 } = useERPEntities(orgId, 'nonprofit', 'program');
  const { entities: volunteers, isLoading: l4 } = useERPEntities(orgId, 'nonprofit', 'volunteer');
  const { entities: campaigns, isLoading: l5 } = useERPEntities(orgId, 'nonprofit', 'campaign');
  const isLoading = l1 || l2 || l3 || l4 || l5;

  const totalDonations = donors.reduce((s: number, d: any) => s + (Number(d.entity_data?.total_given) || 0), 0);
  const grantFunding = grants
    .filter((g: any) => g.entity_data?.status === 'awarded')
    .reduce((s: number, g: any) => s + (Number(g.entity_data?.amount) || 0), 0);
  const totalVolunteerHours = volunteers.reduce((s: number, v: any) => s + (Number(v.entity_data?.hours_logged) || 0), 0);
  const beneficiaries = programs.reduce((s: number, p: any) => s + (Number(p.entity_data?.beneficiaries) || 0), 0);

  const fmt = (n: number) => n >= 1000 ? `$${(n / 1000).toFixed(1)}K` : `$${n}`;

  return (
    <section aria-labelledby="nonprofit-erp-heading" className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 id="nonprofit-erp-heading" className="text-2xl font-bold">Non-Profit Suite</h2>
          <p className="text-muted-foreground">Donors, grants, programs, volunteers, and campaign performance</p>
        </div>
        <Button variant="default" size="sm"><Gift className="mr-2 h-4 w-4" /> Record Donation</Button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Donations', value: fmt(totalDonations), icon: Gift },
          { label: 'Grant Funding', value: fmt(grantFunding), icon: HeartHandshake },
          { label: 'Volunteer Hours', value: totalVolunteerHours.toLocaleString(), icon: Users },
          { label: 'Beneficiaries', value: beneficiaries.toLocaleString(), icon: Megaphone },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-2xl font-bold">{value}</p>}
                </div>
                <Icon className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <IndustryStarterPanel industryKey="nonprofit" />

      <Tabs defaultValue="donors">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="donors"><Card><CardHeader><CardTitle>Donors</CardTitle><CardDescription>Major, sustaining and one-time supporters</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : donors.length === 0 ? <p className="text-sm text-muted-foreground p-4 text-center">No donors yet.</p> : <p className="text-sm text-muted-foreground">{donors.length} donors contributing {fmt(totalDonations)} lifetime.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="grants"><Card><CardHeader><CardTitle>Grants</CardTitle><CardDescription>Pipeline, awards, reporting deadlines</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{grants.length} grants tracked, {fmt(grantFunding)} awarded.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="programs"><Card><CardHeader><CardTitle>Programs</CardTitle><CardDescription>Services and outcome measurement</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{programs.length} active programs serving {beneficiaries.toLocaleString()} beneficiaries.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="volunteers"><Card><CardHeader><CardTitle>Volunteers</CardTitle><CardDescription>Recruit, schedule, recognize</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{volunteers.length} cohorts, {totalVolunteerHours.toLocaleString()} hours logged.</p>}</CardContent></Card></TabsContent>
        <TabsContent value="campaigns"><Card><CardHeader><CardTitle>Campaigns</CardTitle><CardDescription>Goals, progress, donor segments</CardDescription></CardHeader><CardContent>{isLoading ? <Skeleton className="h-20 w-full" /> : <p className="text-sm text-muted-foreground">{campaigns.length} fundraising campaigns running.</p>}</CardContent></Card></TabsContent>
      </Tabs>
    </section>
  );
};

export default NonProfitIndustry;
