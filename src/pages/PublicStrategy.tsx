import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShieldCheck, Target, Gavel, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PublicStrategy = () => {
  const { slug } = useParams<{ slug: string }>();
  const [pack, setPack] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('board_packs' as any)
        .select('*')
        .eq('share_slug', slug)
        .eq('status', 'published')
        .maybeSingle();
      if (error) setError(error.message);
      setPack(data);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !pack) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <FileText className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
            <h2 className="font-semibold mb-1">Strategy not found</h2>
            <p className="text-sm text-muted-foreground">This board pack is not publicly available.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const goals: any[] = pack.snapshot?.goals ?? [];
  const decisions: any[] = pack.snapshot?.decisions ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{pack.title} — Public Strategy</title>
        <meta name="description" content={`${pack.title} · ${pack.period_label ?? ''} board pack snapshot`} />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <header className="border-b bg-card">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <ShieldCheck className="w-3 h-3" /> Signed strategy snapshot
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{pack.title}</h1>
          <div className="text-muted-foreground mt-2 flex items-center gap-3 flex-wrap">
            {pack.period_label && <Badge variant="secondary">{pack.period_label}</Badge>}
            {pack.published_at && (
              <span className="text-sm">Published {new Date(pack.published_at).toLocaleDateString()}</span>
            )}
          </div>
          {pack.notes && <p className="mt-4 text-muted-foreground max-w-3xl">{pack.notes}</p>}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Goals */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" /> Strategic goals
          </h2>
          {goals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No goals captured.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((g) => (
                <Card key={g.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-base">{g.name}</CardTitle>
                      <Badge variant="outline">{g.status}</Badge>
                    </div>
                    {g.description && <CardDescription>{g.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm flex items-center justify-between">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-bold">{g.progress ?? 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-primary" style={{ width: `${g.progress ?? 0}%` }} />
                    </div>
                    {g.target_value != null && (
                      <div className="text-xs text-muted-foreground mt-2">
                        Current: <strong>{g.current_value ?? '—'}</strong> / Target: <strong>{g.target_value}</strong>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Decisions */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Gavel className="w-5 h-5 text-primary" /> Strategic decisions
          </h2>
          {decisions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No decisions captured.</p>
          ) : (
            <div className="space-y-4">
              {decisions.map((d) => {
                const chosen = d.options?.find((o: any) => o.is_chosen);
                return (
                  <Card key={d.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{d.title}</CardTitle>
                        <Badge variant={d.status === 'decided' ? 'default' : 'secondary'}>{d.status}</Badge>
                      </div>
                      {d.context && <CardDescription>{d.context}</CardDescription>}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {chosen && (
                        <div className="border-l-4 border-primary pl-3 py-1 bg-muted/30 rounded-r">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                            Chosen option
                          </div>
                          <div className="font-medium">{chosen.label}</div>
                          {chosen.description && <div className="text-sm text-muted-foreground">{chosen.description}</div>}
                        </div>
                      )}
                      {d.final_rationale && (
                        <div className="text-sm">
                          <span className="font-semibold">Rationale: </span>
                          {d.final_rationale}
                        </div>
                      )}
                      {d.signoffs?.length > 0 && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                          <ShieldCheck className="w-3 h-3" /> Signed by {d.signoffs.length}{' '}
                          {d.signoffs.length === 1 ? 'person' : 'people'}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>

        <footer className="border-t pt-6 text-xs text-muted-foreground">
          Snapshot generated {pack.snapshot?.generated_at ? new Date(pack.snapshot.generated_at).toLocaleString() : ''}.
          This is a signed, version-controlled strategy commitment.
        </footer>
      </main>
    </div>
  );
};

export default PublicStrategy;
