import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { searchContent, type SearchResult } from '@/services/searchService';
import { Target, Lightbulb, FileText, Sparkles, BarChart3, Zap } from 'lucide-react';

const ICONS: Record<SearchResult['type'], React.ComponentType<{ className?: string }>> = {
  goal: Target,
  initiative: Zap,
  review: FileText,
  recommendation: Sparkles,
  metric: BarChart3,
  change: Lightbulb,
};

const LABELS: Record<SearchResult['type'], string> = {
  goal: 'Goals',
  initiative: 'Initiatives',
  review: 'Reviews',
  recommendation: 'Recommendations',
  metric: 'Metrics',
  change: 'Market Changes',
};

const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      const r = await searchContent(query, undefined, 15);
      if (!cancelled) setResults(r);
    };
    const t = setTimeout(run, 180);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] ||= []).push(r);
    return acc;
  }, {});

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search goals, initiatives, decisions… (⌘K)"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {query.trim().length < 2 ? 'Type to search…' : 'No results found.'}
        </CommandEmpty>
        {Object.entries(grouped).map(([type, items]) => {
          const Icon = ICONS[type as SearchResult['type']];
          return (
            <CommandGroup key={type} heading={LABELS[type as SearchResult['type']]}>
              {items.map((r) => (
                <CommandItem
                  key={`${r.type}-${r.id}`}
                  value={`${r.type}-${r.id}-${r.title}`}
                  onSelect={() => {
                    setOpen(false);
                    navigate(r.url);
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span className="font-medium">{r.title}</span>
                    {r.description && (
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {r.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
