// Starter templates for industry suites: KPI definitions, default workflows,
// and seed entities that users can spin up with one click.

export type StarterEntity = {
  module_key: string;
  entity_type: string;
  entity_data: Record<string, any>;
  metadata?: Record<string, any>;
};

export type IndustryKey =
  | 'agriculture'
  | 'technology'
  | 'nonprofit'
  | 'real_estate'
  | 'media'
  | 'telecom'
  | 'government'
  | 'insurance'
  | 'legal'
  | 'automotive'
  | 'aerospace'
  | 'mining'
  | 'food_beverage'
  | 'sports_recreation'
  | 'marketing'
  | 'transportation'
  | 'environmental';

export type IndustryTemplate = {
  industryKey: IndustryKey;
  label: string;
  workflows: { title: string; description: string }[];
  entities: StarterEntity[];
};

const now = () => new Date().toISOString();
const inDays = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

export const INDUSTRY_TEMPLATES: Record<IndustryKey, IndustryTemplate> = {
  agriculture: {
    industryKey: 'agriculture',
    label: 'Agriculture',
    workflows: [
      { title: 'Crop Planning Cycle', description: 'Plan → Plant → Monitor → Harvest → Sell' },
      { title: 'Livestock Health Routine', description: 'Daily inspection, vaccination schedule, yield logging' },
      { title: 'Equipment Maintenance', description: 'Preventive checks for tractors, irrigation, and storage' },
    ],
    entities: [
      { module_key: 'agriculture', entity_type: 'field', entity_data: { name: 'North Field', area_hectares: 25, crop: 'Wheat', status: 'planted' } },
      { module_key: 'agriculture', entity_type: 'field', entity_data: { name: 'South Field', area_hectares: 18, crop: 'Corn', status: 'preparing' } },
      { module_key: 'agriculture', entity_type: 'crop_cycle', entity_data: { name: 'Wheat 2025', crop: 'Wheat', planted_at: now(), expected_yield_tons: 90, stage: 'growing' } },
      { module_key: 'agriculture', entity_type: 'livestock', entity_data: { name: 'Dairy Herd A', type: 'Dairy Cattle', count: 120, health_status: 'healthy' } },
      { module_key: 'agriculture', entity_type: 'equipment', entity_data: { name: 'John Deere Tractor', status: 'operational', last_service: now() } },
    ],
  },
  technology: {
    industryKey: 'technology',
    label: 'Technology',
    workflows: [
      { title: 'Sprint Cycle', description: 'Plan → Build → Review → Ship → Retro (2-week cadence)' },
      { title: 'Incident Response', description: 'Detect → Triage → Mitigate → Postmortem' },
      { title: 'Customer Onboarding', description: 'Trial → Activation → Success Check → Expansion' },
    ],
    entities: [
      { module_key: 'technology', entity_type: 'product', entity_data: { name: 'Core Platform', stage: 'GA', mrr: 45000, users: 1200 } },
      { module_key: 'technology', entity_type: 'sprint', entity_data: { name: 'Sprint 24.1', status: 'in_progress', velocity: 42, completion: 60 } },
      { module_key: 'technology', entity_type: 'incident', entity_data: { name: 'API latency spike', severity: 'medium', status: 'resolved', mttr_minutes: 45 } },
      { module_key: 'technology', entity_type: 'customer', entity_data: { name: 'Acme Corp', plan: 'Enterprise', health_score: 88 } },
      { module_key: 'technology', entity_type: 'release', entity_data: { name: 'v2.4.0', shipped_at: now(), changes: 23 } },
    ],
  },
  nonprofit: {
    industryKey: 'nonprofit',
    label: 'Non-Profit',
    workflows: [
      { title: 'Donor Lifecycle', description: 'Acquire → Engage → Convert → Retain → Upgrade' },
      { title: 'Grant Pipeline', description: 'Identify → Apply → Report → Renew' },
      { title: 'Volunteer Coordination', description: 'Recruit → Train → Schedule → Recognize' },
    ],
    entities: [
      { module_key: 'nonprofit', entity_type: 'donor', entity_data: { name: 'Smith Foundation', total_given: 50000, last_gift_at: now(), tier: 'major' } },
      { module_key: 'nonprofit', entity_type: 'donor', entity_data: { name: 'Community Trust', total_given: 12000, tier: 'sustaining' } },
      { module_key: 'nonprofit', entity_type: 'grant', entity_data: { name: 'Gates Education Grant', funder: 'Gates Foundation', amount: 250000, status: 'awarded', report_due: inDays(90) } },
      { module_key: 'nonprofit', entity_type: 'program', entity_data: { name: 'Literacy Initiative', beneficiaries: 850, budget: 120000, status: 'active' } },
      { module_key: 'nonprofit', entity_type: 'volunteer', entity_data: { name: 'Volunteer Cohort Q1', count: 45, hours_logged: 1280 } },
      { module_key: 'nonprofit', entity_type: 'campaign', entity_data: { name: 'Annual Gala 2025', goal: 100000, raised: 67500, status: 'active' } },
    ],
  },
  real_estate: {
    industryKey: 'real_estate',
    label: 'Real Estate',
    workflows: [
      { title: 'Listing Lifecycle', description: 'List → Market → Show → Offer → Close' },
      { title: 'Tenant Management', description: 'Screen → Lease → Bill → Maintain → Renew' },
      { title: 'Property Maintenance', description: 'Inspect → Schedule → Repair → Verify' },
    ],
    entities: [
      { module_key: 'real_estate', entity_type: 'property', entity_data: { name: '123 Oak Avenue', type: 'Residential', status: 'available', monthly_rent: 2400 } },
      { module_key: 'real_estate', entity_type: 'property', entity_data: { name: 'Downtown Office Suite', type: 'Commercial', status: 'leased', monthly_rent: 8500 } },
      { module_key: 'real_estate', entity_type: 'lease', entity_data: { name: 'Lease #1042', tenant: 'Acme Co', start: now(), end: inDays(365), monthly_rent: 8500 } },
      { module_key: 'real_estate', entity_type: 'listing', entity_data: { name: 'Lakeside Condo', list_price: 450000, days_on_market: 12, status: 'active' } },
      { module_key: 'real_estate', entity_type: 'maintenance', entity_data: { name: 'HVAC Service', property: '123 Oak Avenue', priority: 'medium', status: 'scheduled' } },
    ],
  },
  media: {
    industryKey: 'media',
    label: 'Media & Entertainment',
    workflows: [
      { title: 'Content Production', description: 'Pitch → Script → Produce → Edit → Publish' },
      { title: 'Audience Growth', description: 'Reach → Engage → Subscribe → Monetize' },
      { title: 'Rights & Licensing', description: 'Acquire → Track → License → Renew' },
    ],
    entities: [
      { module_key: 'media', entity_type: 'production', entity_data: { name: 'Documentary Series S1', status: 'in_production', budget: 320000, episodes: 6 } },
      { module_key: 'media', entity_type: 'asset', entity_data: { name: 'Episode 01 Master', type: 'video', duration_min: 48, format: '4K' } },
      { module_key: 'media', entity_type: 'channel', entity_data: { name: 'YouTube Main', platform: 'YouTube', subscribers: 124000, monthly_views: 2400000 } },
      { module_key: 'media', entity_type: 'campaign', entity_data: { name: 'Premiere Promo', spend: 18000, impressions: 1200000, ctr: 2.1 } },
      { module_key: 'media', entity_type: 'license', entity_data: { name: 'Music License - Track 14', expires_at: inDays(180), cost: 4500, territory: 'Worldwide' } },
    ],
  },
  telecom: {
    industryKey: 'telecom',
    label: 'Telecommunications',
    workflows: [
      { title: 'Subscriber Lifecycle', description: 'Acquire → Activate → Bill → Support → Retain' },
      { title: 'Network Operations', description: 'Monitor → Detect → Dispatch → Resolve' },
      { title: 'Tower & Site Maintenance', description: 'Inspect → Schedule → Repair → Audit' },
    ],
    entities: [
      { module_key: 'telecom', entity_type: 'plan', entity_data: { name: 'Unlimited 5G', price_monthly: 65, subscribers: 12450 } },
      { module_key: 'telecom', entity_type: 'subscriber_segment', entity_data: { name: 'Postpaid Consumer', count: 84200, arpu: 52 } },
      { module_key: 'telecom', entity_type: 'cell_site', entity_data: { name: 'Site NYC-204', uptime_pct: 99.92, status: 'operational' } },
      { module_key: 'telecom', entity_type: 'incident', entity_data: { name: 'Fiber cut - Route 9', severity: 'high', status: 'resolved', affected_users: 1800 } },
      { module_key: 'telecom', entity_type: 'sla', entity_data: { name: 'Enterprise SLA', target_uptime: 99.99, current: 99.97 } },
    ],
  },
  government: {
    industryKey: 'government',
    label: 'Government & Public Sector',
    workflows: [
      { title: 'Citizen Services', description: 'Request → Validate → Process → Deliver' },
      { title: 'Procurement & Tender', description: 'RFP → Bid → Award → Audit' },
      { title: 'Policy Rollout', description: 'Draft → Review → Approve → Implement → Measure' },
    ],
    entities: [
      { module_key: 'government', entity_type: 'service_request', entity_data: { name: 'Pothole Repair - 5th Ave', status: 'open', priority: 'medium', sla_days: 7 } },
      { module_key: 'government', entity_type: 'permit', entity_data: { name: 'Building Permit BP-2310', status: 'under_review', applicant: 'Smith Construction' } },
      { module_key: 'government', entity_type: 'tender', entity_data: { name: 'Road Resurfacing 2025', budget: 1250000, bidders: 7, status: 'evaluation' } },
      { module_key: 'government', entity_type: 'program', entity_data: { name: 'Senior Wellness', budget: 480000, beneficiaries: 3200, status: 'active' } },
      { module_key: 'government', entity_type: 'compliance_audit', entity_data: { name: 'Annual Financial Audit', due: inDays(60), status: 'in_progress' } },
    ],
  },
  insurance: {
    industryKey: 'insurance',
    label: 'Insurance',
    workflows: [
      { title: 'Policy Lifecycle', description: 'Quote → Underwrite → Bind → Renew' },
      { title: 'Claims Processing', description: 'Report → Investigate → Adjust → Pay' },
      { title: 'Risk Assessment', description: 'Score → Review → Price → Approve' },
    ],
    entities: [
      { module_key: 'insurance', entity_type: 'policy', entity_data: { name: 'Auto Policy A-10245', premium_annual: 1280, status: 'active' } },
      { module_key: 'insurance', entity_type: 'policy', entity_data: { name: 'Home Policy H-77201', premium_annual: 1840, status: 'active' } },
      { module_key: 'insurance', entity_type: 'claim', entity_data: { name: 'Claim CL-9921', amount: 8400, status: 'in_review', reported_at: now() } },
      { module_key: 'insurance', entity_type: 'underwriting', entity_data: { name: 'UW Queue - Commercial', pending: 24, avg_days: 4.2 } },
      { module_key: 'insurance', entity_type: 'agent', entity_data: { name: 'Jane Doe', region: 'Northeast', policies_sold_ytd: 142 } },
    ],
  },
  legal: {
    industryKey: 'legal',
    label: 'Legal Services',
    workflows: [
      { title: 'Matter Lifecycle', description: 'Intake → Conflict Check → Engagement → Work → Bill' },
      { title: 'Document Review', description: 'Ingest → Tag → Review → Produce' },
      { title: 'Compliance & Filings', description: 'Track deadlines → Prepare → File → Confirm' },
    ],
    entities: [
      { module_key: 'legal', entity_type: 'matter', entity_data: { name: 'Acme v. Globex', practice_area: 'Litigation', status: 'active', billable_hours: 184 } },
      { module_key: 'legal', entity_type: 'matter', entity_data: { name: 'Series B Financing', practice_area: 'Corporate', status: 'active', billable_hours: 92 } },
      { module_key: 'legal', entity_type: 'document', entity_data: { name: 'NDA Template v3', type: 'template', last_updated: now() } },
      { module_key: 'legal', entity_type: 'time_entry', entity_data: { name: 'Discovery review - Acme', hours: 6.5, rate: 425, billed: false } },
      { module_key: 'legal', entity_type: 'deadline', entity_data: { name: 'Motion to Dismiss filing', due: inDays(14), priority: 'high' } },
    ],
  },
  automotive: {
    industryKey: 'automotive',
    label: 'Automotive',
    workflows: [
      { title: 'Vehicle Production', description: 'Order → Build → QA → Deliver' },
      { title: 'Dealer Operations', description: 'Inventory → Sale → Finance → Service' },
      { title: 'Service & Warranty', description: 'Schedule → Diagnose → Repair → Warranty Claim' },
    ],
    entities: [
      { module_key: 'automotive', entity_type: 'vehicle_model', entity_data: { name: 'Sedan EV-3', units_ordered: 4200, units_built: 3120 } },
      { module_key: 'automotive', entity_type: 'dealer', entity_data: { name: 'Metro Auto Group', region: 'West', monthly_sales: 184 } },
      { module_key: 'automotive', entity_type: 'inventory', entity_data: { name: 'Lot Inventory - Q1', units_on_lot: 412, days_supply: 38 } },
      { module_key: 'automotive', entity_type: 'service_order', entity_data: { name: 'SO-22014', vin: '1HG...92', status: 'in_progress', est_hours: 3.5 } },
      { module_key: 'automotive', entity_type: 'recall', entity_data: { name: 'Brake Pad Recall 24-A', affected_vins: 1820, completion_pct: 64 } },
    ],
  },
  aerospace: {
    industryKey: 'aerospace',
    label: 'Aerospace & Defense',
    workflows: [
      { title: 'Program Management', description: 'Concept → Design → Build → Test → Certify' },
      { title: 'MRO Operations', description: 'Inspect → Maintain → Repair → Overhaul' },
      { title: 'Compliance & Certification', description: 'Spec → Audit → Document → Certify' },
    ],
    entities: [
      { module_key: 'aerospace', entity_type: 'program', entity_data: { name: 'Next-Gen Avionics', budget: 18500000, completion_pct: 42, status: 'on_track' } },
      { module_key: 'aerospace', entity_type: 'aircraft', entity_data: { name: 'Tail N1024X', flight_hours: 12480, next_maintenance: inDays(45) } },
      { module_key: 'aerospace', entity_type: 'work_order', entity_data: { name: 'Engine Inspection WO-882', status: 'open', priority: 'high' } },
      { module_key: 'aerospace', entity_type: 'supplier', entity_data: { name: 'Precision Components Inc', tier: 'Tier 1', on_time_pct: 96.4 } },
      { module_key: 'aerospace', entity_type: 'certification', entity_data: { name: 'FAA Part 145', expires_at: inDays(365), status: 'current' } },
    ],
  },
  mining: {
    industryKey: 'mining',
    label: 'Mining & Metals',
    workflows: [
      { title: 'Extraction Cycle', description: 'Survey → Drill → Blast → Haul → Process' },
      { title: 'Equipment Reliability', description: 'Monitor → Predict → Maintain → Replace' },
      { title: 'Environmental Compliance', description: 'Measure → Report → Remediate → Audit' },
    ],
    entities: [
      { module_key: 'mining', entity_type: 'site', entity_data: { name: 'Pit 7 - Copper', daily_tonnage: 4800, status: 'active' } },
      { module_key: 'mining', entity_type: 'equipment', entity_data: { name: 'Haul Truck HT-12', utilization_pct: 78, next_service: inDays(20) } },
      { module_key: 'mining', entity_type: 'production_run', entity_data: { name: 'Q1 Smelt Batch', tons_processed: 12400, grade_pct: 1.84 } },
      { module_key: 'mining', entity_type: 'safety_incident', entity_data: { name: 'Near Miss - Pit 3', severity: 'low', status: 'closed' } },
      { module_key: 'mining', entity_type: 'env_report', entity_data: { name: 'Water Quality - March', status: 'submitted', compliant: true } },
    ],
  },
  food_beverage: {
    industryKey: 'food_beverage',
    label: 'Food & Beverage',
    workflows: [
      { title: 'Recipe to Plate', description: 'Source → Prep → Cook → Serve → Review' },
      { title: 'Inventory & Waste', description: 'Receive → Store → Use → Track waste' },
      { title: 'Food Safety (HACCP)', description: 'Identify → Monitor → Correct → Verify' },
    ],
    entities: [
      { module_key: 'food_beverage', entity_type: 'menu_item', entity_data: { name: 'Signature Burger', price: 14.5, monthly_sold: 2840, food_cost_pct: 28 } },
      { module_key: 'food_beverage', entity_type: 'recipe', entity_data: { name: 'House Marinara', yield_servings: 50, cost_per_serving: 0.82 } },
      { module_key: 'food_beverage', entity_type: 'supplier', entity_data: { name: 'Fresh Produce Co', on_time_pct: 94, quality_score: 4.6 } },
      { module_key: 'food_beverage', entity_type: 'inventory_item', entity_data: { name: 'Tomatoes (case)', on_hand: 24, reorder_point: 10 } },
      { module_key: 'food_beverage', entity_type: 'haccp_check', entity_data: { name: 'Walk-in Cooler Temp', status: 'pass', logged_at: now() } },
    ],
  },
  sports_recreation: {
    industryKey: 'sports_recreation',
    label: 'Sports & Recreation',
    workflows: [
      { title: 'Membership Lifecycle', description: 'Trial → Join → Engage → Renew' },
      { title: 'Event & League Ops', description: 'Schedule → Register → Run → Score → Recap' },
      { title: 'Facility Management', description: 'Book → Use → Clean → Maintain' },
    ],
    entities: [
      { module_key: 'sports_recreation', entity_type: 'membership_tier', entity_data: { name: 'Premium', monthly_fee: 89, active_members: 1240 } },
      { module_key: 'sports_recreation', entity_type: 'event', entity_data: { name: 'Spring 5K', registrants: 412, status: 'open', date: inDays(45) } },
      { module_key: 'sports_recreation', entity_type: 'team', entity_data: { name: 'Adult League A', players: 18, wins: 7, losses: 3 } },
      { module_key: 'sports_recreation', entity_type: 'facility', entity_data: { name: 'Court 1', utilization_pct: 72, status: 'available' } },
      { module_key: 'sports_recreation', entity_type: 'class', entity_data: { name: 'Yoga Flow', weekly_attendance: 38, instructor: 'Mei L.' } },
    ],
  },
  marketing: {
    industryKey: 'marketing',
    label: 'Marketing & Creative Agency',
    workflows: [
      { title: 'Campaign Lifecycle', description: 'Brief → Strategy → Create → Launch → Measure' },
      { title: 'Client Onboarding', description: 'Pitch → Sign → Kickoff → Discovery → Plan' },
      { title: 'Creative Production', description: 'Concept → Draft → Review → Approve → Ship' },
    ],
    entities: [
      { module_key: 'marketing', entity_type: 'client', entity_data: { name: 'Acme Apparel', mrr: 18500, health: 'green', renewal: inDays(120) } },
      { module_key: 'marketing', entity_type: 'campaign', entity_data: { name: 'Summer Launch 2025', spend: 42000, ctr: 3.4, conversions: 1820 } },
      { module_key: 'marketing', entity_type: 'creative_asset', entity_data: { name: 'Hero Banner v3', status: 'approved', channel: 'web' } },
      { module_key: 'marketing', entity_type: 'project', entity_data: { name: 'Brand Refresh', billable_hours: 240, budget: 65000, status: 'in_progress' } },
      { module_key: 'marketing', entity_type: 'lead', entity_data: { name: 'Globex Co - RFP', stage: 'proposal', value: 120000 } },
    ],
  },
  transportation: {
    industryKey: 'transportation',
    label: 'Transportation & Mobility',
    workflows: [
      { title: 'Trip Operations', description: 'Schedule → Dispatch → Monitor → Complete' },
      { title: 'Fleet Maintenance', description: 'Inspect → Service → Repair → Certify' },
      { title: 'Driver Management', description: 'Hire → Train → Certify → Evaluate' },
    ],
    entities: [
      { module_key: 'transportation', entity_type: 'route', entity_data: { name: 'Route 12 - Express', daily_trips: 24, on_time_pct: 92 } },
      { module_key: 'transportation', entity_type: 'vehicle', entity_data: { name: 'Bus #4421', odometer_km: 184200, status: 'in_service' } },
      { module_key: 'transportation', entity_type: 'driver', entity_data: { name: 'Carlos M.', certifications: 'CDL-A, Hazmat', safety_score: 96 } },
      { module_key: 'transportation', entity_type: 'trip', entity_data: { name: 'Trip T-90213', status: 'completed', distance_km: 142 } },
      { module_key: 'transportation', entity_type: 'maintenance', entity_data: { name: 'Brake Service - Bus #4421', status: 'scheduled', due: inDays(7) } },
    ],
  },
  environmental: {
    industryKey: 'environmental',
    label: 'Environmental & Sustainability',
    workflows: [
      { title: 'Emissions Tracking', description: 'Measure → Report → Reduce → Verify' },
      { title: 'Site Remediation', description: 'Assess → Plan → Remediate → Monitor' },
      { title: 'ESG Reporting', description: 'Collect → Validate → Disclose → Improve' },
    ],
    entities: [
      { module_key: 'environmental', entity_type: 'emissions_source', entity_data: { name: 'Plant 1 - Stack A', co2e_tons_yr: 8400, scope: 'Scope 1' } },
      { module_key: 'environmental', entity_type: 'project', entity_data: { name: 'Solar Retrofit HQ', capex: 420000, expected_co2_reduction: 320 } },
      { module_key: 'environmental', entity_type: 'audit', entity_data: { name: 'ISO 14001 Audit', status: 'scheduled', due: inDays(75) } },
      { module_key: 'environmental', entity_type: 'kpi', entity_data: { name: 'Water Use Intensity', value: 2.4, unit: 'm3/unit', target: 2.0 } },
      { module_key: 'environmental', entity_type: 'incident', entity_data: { name: 'Minor spill - warehouse', severity: 'low', status: 'remediated' } },
    ],
  },
};
