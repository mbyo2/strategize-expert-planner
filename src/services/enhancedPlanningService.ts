
import { planningCRUD } from './planning/planningCRUD';
import { planningMilestones } from './planning/planningMilestones';
import { planningAnalytics } from './planning/planningAnalytics';

// Re-export types
export type { 
  EnhancedPlanningInitiative, 
  ResourceRequirement, 
  Stakeholder, 
  Risk, 
  SuccessMetric,
  InitiativeMilestone 
} from './planning/planningTypes';

export const enhancedPlanningService = {
  ...planningCRUD,
  ...planningMilestones,
  ...planningAnalytics
};
