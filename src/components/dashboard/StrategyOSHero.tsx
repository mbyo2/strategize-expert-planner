import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Gavel, FileText, Zap, ArrowRight, Globe, Loader2 } from 'lucide-react';
import { useDecisionLog } from '@/hooks/useDecisionLog';
import { useBoardPacks } from '@/hooks/useBoardPacks';
import { useStrategyERPBindings } from '@/hooks/useStrategyERPBindings';

const StrategyOSHero: React.FC = () => {
  const { decisions, isLoading: decLoading } = useDecisionLog();
  const { packs, isLoading: packsLoading } = useBoardPacks();
  const { bindings, isLoading: bindLoading } = useStrategyERPBindings();

  const loading = decLoading || packsLoading || bindLoading;
  const openDecisions = decisions.filter((d) => d.status === 'open').length;
  const decided = decisions.filter((d) => d.status === 'decided').length;
  const lastPublished = (packs as any[]).find((p) => p.status === 'published');
  const syncedBindings = (bindings as any[]).filter((b) => b.last_synced_at).length;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              <h3 className="text-base font-semibold">Strategy OS</h3>
              <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">New</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Live ERP-bound goals, accountable decisions, signed board packs.
            </p>
          </div>
          {lastPublished?.share_slug && (
            <Button asChild size="sm" variant="outline">
              <a href={`/strategy/${lastPublished.share_slug}`} target="_blank" rel="noreferrer">
                <Globe className="w-3 h-3 mr-1" /> View public strategy
              </a>
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            <Link to="/decisions" className="group border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Gavel className="w-3 h-3" /> Decisions
                </div>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>
              <div className="text-2xl font-bold mt-1">{decisions.length}</div>
              <div className="text-xs text-muted-foreground">{openDecisions} open · {decided} finalized</div>
            </Link>

            <Link to="/erp" className="group border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3 text-primary" /> Live ERP bindings
                </div>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>
              <div className="text-2xl font-bold mt-1">{bindings.length}</div>
              <div className="text-xs text-muted-foreground">{syncedBindings} synced</div>
            </Link>

            <Link to="/board-packs" className="group border rounded-lg p-3 hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Board packs
                </div>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity" />
              </div>
              <div className="text-2xl font-bold mt-1">{packs.length}</div>
              <div className="text-xs text-muted-foreground">
                {lastPublished ? `Last published ${new Date(lastPublished.published_at).toLocaleDateString()}` : 'No published yet'}
              </div>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StrategyOSHero;
