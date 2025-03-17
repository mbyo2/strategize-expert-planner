
import React from 'react';
import { Target, Check, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Goal {
  id: number;
  name: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'planned';
  dueDate: string;
}

const goals: Goal[] = [
  {
    id: 1,
    name: 'Increase market share by 5%',
    progress: 65,
    status: 'in-progress',
    dueDate: 'Dec 2023'
  },
  {
    id: 2,
    name: 'Launch new product line',
    progress: 100,
    status: 'completed',
    dueDate: 'Oct 2023'
  },
  {
    id: 3,
    name: 'Expand to international markets',
    progress: 30,
    status: 'in-progress',
    dueDate: 'Mar 2024'
  },
  {
    id: 4,
    name: 'Improve customer retention rate',
    progress: 100,
    status: 'completed',
    dueDate: 'Nov 2023'
  },
];

const StrategicGoals: React.FC = () => {
  return (
    <div className="space-y-4">
      {goals.map((goal) => (
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
          
          <Progress value={goal.progress} className="h-1.5 mb-1" />
          
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
              {goal.dueDate}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StrategicGoals;
