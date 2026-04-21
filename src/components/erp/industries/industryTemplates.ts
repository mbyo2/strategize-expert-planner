// Starter templates for industry suites: KPI definitions, default workflows,
// and seed entities that users can spin up with one click.

export type StarterEntity = {
  module_key: string;
  entity_type: string;
  entity_data: Record<string, any>;
  metadata?: Record<string, any>;
};

export type IndustryTemplate = {
  industryKey: 'agriculture' | 'technology' | 'nonprofit';
  label: string;
  workflows: { title: string; description: string }[];
  entities: StarterEntity[];
};

export const INDUSTRY_TEMPLATES: Record<string, IndustryTemplate> = {
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
      { module_key: 'agriculture', entity_type: 'crop_cycle', entity_data: { crop: 'Wheat', planted_at: new Date().toISOString(), expected_yield_tons: 90, stage: 'growing' } },
      { module_key: 'agriculture', entity_type: 'livestock', entity_data: { type: 'Dairy Cattle', count: 120, health_status: 'healthy' } },
      { module_key: 'agriculture', entity_type: 'equipment', entity_data: { name: 'John Deere Tractor', status: 'operational', last_service: new Date().toISOString() } },
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
      { module_key: 'technology', entity_type: 'incident', entity_data: { title: 'API latency spike', severity: 'medium', status: 'resolved', mttr_minutes: 45 } },
      { module_key: 'technology', entity_type: 'customer', entity_data: { name: 'Acme Corp', plan: 'Enterprise', health_score: 88 } },
      { module_key: 'technology', entity_type: 'release', entity_data: { version: 'v2.4.0', shipped_at: new Date().toISOString(), changes: 23 } },
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
      { module_key: 'nonprofit', entity_type: 'donor', entity_data: { name: 'Smith Foundation', total_given: 50000, last_gift_at: new Date().toISOString(), tier: 'major' } },
      { module_key: 'nonprofit', entity_type: 'donor', entity_data: { name: 'Community Trust', total_given: 12000, tier: 'sustaining' } },
      { module_key: 'nonprofit', entity_type: 'grant', entity_data: { funder: 'Gates Foundation', amount: 250000, status: 'awarded', report_due: new Date(Date.now() + 90 * 86400000).toISOString() } },
      { module_key: 'nonprofit', entity_type: 'program', entity_data: { name: 'Literacy Initiative', beneficiaries: 850, budget: 120000, status: 'active' } },
      { module_key: 'nonprofit', entity_type: 'volunteer', entity_data: { name: 'Volunteer Cohort Q1', count: 45, hours_logged: 1280 } },
      { module_key: 'nonprofit', entity_type: 'campaign', entity_data: { name: 'Annual Gala 2025', goal: 100000, raised: 67500, status: 'active' } },
    ],
  },
};
