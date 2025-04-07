
import React, { useEffect, useState } from 'react';
import { Target, Check, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchStrategicGoals, StrategicGoal } from '@/services/strategicGoalsService';
import { format } from 'date-fns';

const StrategicGoals: React.FC = () => {
  const [goals, setGoals] = useState<StrategicGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGoals = async () => {
      try {
        setLoading(true);
        const fetchedGoals = await fetchStrategicGoals();
        setGoals(fetchedGoals);
      } catch (error) {
        console.error('Error loading strategic goals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="pb-3 last:pb-0">
            <div className="flex justify-between items-center mb-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-1.5 w-full mb-1" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.length > 0 ? (
        goals.map((goal) => (
          <div key={goal.id} className="pb-3 last:pb-0">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                {goal.status === 'completed' ? (
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Target className="h-4 w-4 text-primary mr-2" />
                )}
                <span className="text-sm font-medium">{goal.name}</span>
              </div>
              <span className="text-xs font-medium">
                {goal.progress}%
              </span>
            </div>
            
            <Progress 
              value={goal.progress} 
              className="h-1.5 mb-1" 
              indicatorClassName={goal.status === 'completed' ? "bg-green-500" : "bg-primary"} 
            />
            
            <div className="flex justify-between items-center">
              <span className={`text-xs ${
                goal.status === 'completed' 
                  ? 'text-green-500' 
                  : 'text-muted-foreground'
              }`}>
                {goal.status === 'completed' ? 'Completed' : 'In Progress'}
              </span>
              <span className="text-xs flex items-center text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" /> 
                {goal.due_date ? format(new Date(goal.due_date), 'MMM yyyy') : 'No deadline'}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-sm text-muted-foreground py-4">
          No strategic goals found. Add some goals to get started.
        </div>
      )}
    </div>
  );
};

export default StrategicGoals;
