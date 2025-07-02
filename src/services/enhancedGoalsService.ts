
import { goalCRUD } from './goals/goalCRUD';
import { goalComments } from './goals/goalComments';
import { goalAttachments } from './goals/goalAttachments';
import { goalAnalytics } from './goals/goalAnalytics';

// Re-export types
export type { EnhancedStrategicGoal, GoalMilestone, GoalComment, GoalAttachment } from './goals/goalTypes';

export const enhancedGoalsService = {
  ...goalCRUD,
  ...goalComments,
  ...goalAttachments,
  ...goalAnalytics
};
