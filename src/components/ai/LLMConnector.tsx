import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Send, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Msg = { role: 'user' | 'assistant'; content: string };

const MODELS = [
  { id: 'qwen-plus', label: 'Qwen Plus (balanced)' },
  { id: 'qwen-max', label: 'Qwen Max (most capable)' },
  { id: 'qwen-turbo', label: 'Qwen Turbo (fast & cheap)' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;

const LLMConnector: React.FC = () => {
  const [model, setModel] = useState('qwen-plus');
  const [input, setInput] = useState('Summarize our top strategic risks for the next quarter.');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const controller = new AbortController();
      abortRef.current = controller;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], model }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: 'Request failed' }));
        if (resp.status === 429) toast.error('Rate limited — try again shortly');
        else if (resp.status === 401) toast.error('Invalid API key — check DASHSCOPE_API_KEY');
        else toast.error(err.error || 'AI request failed');
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistant = '';
      let done = false;

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') { done = true; break; }
          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages(prev => {
                const next = [...prev];
                next[next.length - 1] = { role: 'assistant', content: assistant };
                return next;
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        console.error(e);
        toast.error('Failed to reach AI service');
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Assistant — Alibaba Model Studio (Qwen)
        </CardTitle>
        <CardDescription>
          Streaming chat powered by your DASHSCOPE_API_KEY through a secure edge function.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Label htmlFor="model" className="shrink-0">Model</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="model" className="max-w-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MODELS.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="border rounded-lg p-4 min-h-[260px] max-h-[420px] overflow-y-auto space-y-3 bg-muted/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Sparkles className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Ask anything about strategy, goals, or operations</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg whitespace-pre-wrap text-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-background mr-8 border'
                }`}
              >
                {m.content || (loading && i === messages.length - 1 ? '…' : '')}
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the AI…"
            className="min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); }
            }}
          />
          <Button onClick={send} disabled={loading || !input.trim()} className="self-end">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Tip: ⌘/Ctrl + Enter to send</p>
      </CardContent>
    </Card>
  );
};

export default LLMConnector;
