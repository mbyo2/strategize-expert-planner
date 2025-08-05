import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useStrategicGoals } from '@/hooks/useStrategicGoals';
import { usePlanningInitiatives } from '@/hooks/usePlanningInitiatives';
import { useERPEntities, useERPStrategicIntegration } from '@/hooks/useERP';
import { Link2, Target, Calendar, TrendingUp, AlertCircle } from 'lucide-react';

interface ERPStrategicIntegrationProps {
  organizationId: string;
  moduleKey?: string;
}

const LINK_TYPES = [
  { value: 'supports', label: 'Supports', description: 'ERP data supports this strategic element', color: 'bg-green-100 text-green-800' },
  { value: 'measures', label: 'Measures', description: 'ERP data provides metrics for this element', color: 'bg-blue-100 text-blue-800' },
  { value: 'depends_on', label: 'Depends On', description: 'Strategic element depends on this ERP data', color: 'bg-orange-100 text-orange-800' },
  { value: 'impacts', label: 'Impacts', description: 'ERP data directly impacts this strategic element', color: 'bg-purple-100 text-purple-800' }
];

const ERPStrategicIntegration: React.FC<ERPStrategicIntegrationProps> = ({
  organizationId,
  moduleKey
}) => {
  const { goals } = useStrategicGoals();
  const { initiatives } = usePlanningInitiatives();
  const { entities } = useERPEntities(organizationId, moduleKey);
  const { links, linkToStrategy, unlinkFromStrategy, isLinking } = useERPStrategicIntegration(organizationId);

  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [selectedInitiative, setSelectedInitiative] = useState<string>('');
  const [linkType, setLinkType] = useState<string>('supports');
  const [impactWeight, setImpactWeight] = useState<number>(1.0);

  const handleCreateLink = () => {
    if (!selectedEntity || (!selectedGoal && !selectedInitiative)) {
      return;
    }

    linkToStrategy({
      organization_id: organizationId,
      erp_entity_id: selectedEntity,
      strategic_goal_id: selectedGoal || undefined,
      planning_initiative_id: selectedInitiative || undefined,
      link_type: linkType as any,
      impact_weight: impactWeight,
      metadata: {}
    });

    // Reset form
    setSelectedEntity('');
    setSelectedGoal('');
    setSelectedInitiative('');
    setLinkType('supports');
    setImpactWeight(1.0);
  };

  const existingLinks = links.filter(link => 
    !moduleKey || entities.some(entity => entity.id === link.erp_entity_id && entity.module_key === moduleKey)
  );

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Strategic Integration</h3>
        <p className="text-sm text-muted-foreground">
          Link ERP data to your strategic goals and planning initiatives to track real impact
        </p>
      </div>

      {/* Create New Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Create Strategic Link
          </CardTitle>
          <CardDescription>
            Connect ERP entities with strategic goals or planning initiatives
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="entity">ERP Entity</Label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an ERP entity" />
                </SelectTrigger>
                <SelectContent>
                  {entities.map((entity) => (
                    <SelectItem key={entity.id} value={entity.id}>
                      <div>
                        <div className="font-medium">
                          {entity.entity_data.name || entity.entity_type}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entity.module_key} • {entity.entity_type}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link-type">Link Type</Label>
              <Select value={linkType} onValueChange={setLinkType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LINK_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {type.description}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Strategic Goal (Optional)</Label>
              <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a strategic goal" />
                </SelectTrigger>
                <SelectContent>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        {goal.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initiative">Planning Initiative (Optional)</Label>
              <Select value={selectedInitiative} onValueChange={setSelectedInitiative}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a planning initiative" />
                </SelectTrigger>
                <SelectContent>
                  {initiatives.map((initiative) => (
                    <SelectItem key={initiative.id} value={initiative.id}>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {initiative.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact-weight">Impact Weight (0.1 - 5.0)</Label>
            <Input
              id="impact-weight"
              type="number"
              min="0.1"
              max="5.0"
              step="0.1"
              value={impactWeight}
              onChange={(e) => setImpactWeight(parseFloat(e.target.value) || 1.0)}
              placeholder="1.0"
            />
          </div>

          <Button 
            onClick={handleCreateLink}
            disabled={!selectedEntity || (!selectedGoal && !selectedInitiative) || isLinking}
            className="w-full"
          >
            {isLinking ? 'Creating Link...' : 'Create Strategic Link'}
          </Button>
        </CardContent>
      </Card>

      {/* Existing Links */}
      <div className="space-y-4">
        <h4 className="font-medium flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Existing Strategic Links ({existingLinks.length})
        </h4>

        {existingLinks.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No strategic links created yet. Start linking your ERP data to strategic goals and initiatives.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {existingLinks.map((link) => {
              const entity = entities.find(e => e.id === link.erp_entity_id);
              const goal = goals.find(g => g.id === link.strategic_goal_id);
              const initiative = initiatives.find(i => i.id === link.planning_initiative_id);
              const linkTypeInfo = LINK_TYPES.find(t => t.value === link.link_type);

              return (
                <Card key={link.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={linkTypeInfo?.color || 'bg-gray-100 text-gray-800'}>
                          {linkTypeInfo?.label || link.link_type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Weight: {link.impact_weight}
                        </span>
                      </div>
                      
                      <div className="text-sm">
                        <div className="font-medium">
                          {entity?.entity_data.name || entity?.entity_type || 'Unknown Entity'}
                        </div>
                        <div className="text-muted-foreground">
                          {entity?.module_key} • Links to: {goal?.name || initiative?.name}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => unlinkFromStrategy(link.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ERPStrategicIntegration;
