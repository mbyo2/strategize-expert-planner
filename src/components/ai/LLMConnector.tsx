import React, { useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brain, Send, Sparkles, Loader2, AlertTriangle, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type Msg = { role: 'user' | 'assistant'; content: string };

type ChatError = {
  title: string;
  detail?: string;
  hint?: string;
  code?: string;
  status?: number;
  upstreamStatus?: number;
  upstreamBody?: string;
};

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
  const [lastError, setLastError] = useState<ChatError | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Msg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setLastError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        const msg = 'You must be signed in to use the AI assistant.';
        setLastError({ title: 'Not signed in', detail: msg, hint: 'Refresh the page and log in again.' });
        toast.error(msg);
        setLoading(false);
        return;
      }
      const controller = new AbortController();
      abortRef.current = controller;

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg], model }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.json().catch(() => ({ error: `HTTP ${resp.status}` }));
        const code = err.code || `HTTP_${resp.status}`;
        let title = err.error || 'AI request failed';
        let hint = err.hint as string | undefined;

        if (resp.status === 401 && code === 'UNAUTHORIZED_NO_AUTH_HEADER') {
          title = 'Not authenticated to edge function';
          hint = 'Your Supabase session expired. Refresh and log back in.';
        } else if (resp.status === 401 && code === 'INVALID_API_KEY') {
          title = 'Alibaba rejected the Model Studio API key';
        } else if (resp.status === 403) {
          title = 'Model not enabled on this Alibaba account';
        } else if (resp.status === 429) {
          title = 'Rate limited or out of credits';
        } else if (resp.status === 502 || resp.status === 503) {
          title = 'Cannot reach Alibaba Model Studio';
        } else if (code === 'MISSING_API_KEY') {
          title = 'DASHSCOPE_API_KEY not configured on the server';
        }

        setLastError({
          title,
          detail: err.error,
          hint,
          code,
          status: resp.status,
          upstreamStatus: err.upstream_status,
          upstreamBody: err.upstream_body,
        });
        toast.error(title, { description: hint?.slice(0, 120) });
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let assistant = '';
      let done = false;
      let receivedAny = false;

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
              receivedAny = true;
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

      if (!receivedAny) {
        const msg = 'Stream ended without any content';
        setLastError({
          title: msg,
          hint: 'The connection closed before Alibaba sent any tokens. This usually means the model rejected the request silently — try qwen-turbo, shorten the prompt, or check your account balance.',
          code: 'EMPTY_STREAM',
        });
        toast.error(msg);
      }
    } catch (e: any) {
      if (e?.name === 'AbortError') return;
      console.error(e);
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      setLastError({
        title: offline ? 'You appear to be offline' : 'Connection to AI service interrupted',
        detail: e?.message,
        hint: offline
          ? 'Reconnect to the internet and retry.'
          : 'The streaming connection dropped mid-response. Retry; if it keeps happening, check the ai-chat edge function logs.',
        code: 'STREAM_INTERRUPTED',
      });
      toast.error('AI stream interrupted', { description: e?.message?.slice(0, 120) });
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

        {lastError && (
          <Alert variant="destructive" className="relative">
            <AlertTriangle className="h-4 w-4" />
            <button
              onClick={() => setLastError(null)}
              className="absolute right-2 top-2 opacity-70 hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
            <AlertTitle>{lastError.title}</AlertTitle>
            <AlertDescription className="space-y-2 text-sm">
              {lastError.hint && <p>{lastError.hint}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs opacity-80">
                {lastError.code && <span><strong>Code:</strong> {lastError.code}</span>}
                {lastError.status && <span><strong>HTTP:</strong> {lastError.status}</span>}
                {lastError.upstreamStatus && (
                  <span><strong>Alibaba HTTP:</strong> {lastError.upstreamStatus}</span>
                )}
              </div>
              {lastError.upstreamBody && (
                <details className="mt-1">
                  <summary className="cursor-pointer text-xs opacity-80 hover:opacity-100">
                    Show provider response
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap break-all rounded bg-background/50 p-2 text-[11px] max-h-40 overflow-auto">
                    {lastError.upstreamBody}
                  </pre>
                </details>
              )}
              {(lastError.code === 'INVALID_API_KEY' ||
                lastError.code === 'MISSING_API_KEY' ||
                lastError.code === 'INVALID_API_KEY_FORMAT') && (
                <p className="text-xs">
                  Update the secret in{' '}
                  <a
                    className="underline"
                    href="https://supabase.com/dashboard/project/ublzhmimdynqzqsdicyn/settings/functions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Edge Function Secrets → DASHSCOPE_API_KEY
                  </a>
                  .
                </p>
              )}
              <p className="text-xs">
                <a
                  className="underline"
                  href="https://supabase.com/dashboard/project/ublzhmimdynqzqsdicyn/functions/ai-chat/logs"
                  target="_blank"
                  rel="noreferrer"
                >
                  View edge function logs →
                </a>
              </p>
            </AlertDescription>
          </Alert>
        )}

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
