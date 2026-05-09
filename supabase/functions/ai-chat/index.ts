// Alibaba Cloud Model Studio (DashScope) chat — OpenAI-compatible streaming
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DASHSCOPE_URL =
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("DASHSCOPE_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "DASHSCOPE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const model = typeof body.model === "string" ? body.model : "qwen-plus";
    const stream = body.stream !== false;
    const system =
      typeof body.system === "string"
        ? body.system
        : "You are a helpful AI assistant for strategic analysis and decision support. Be concise and actionable.";

    const finalMessages =
      messages[0]?.role === "system"
        ? messages
        : [{ role: "system", content: system }, ...messages];

    const upstream = await fetch(DASHSCOPE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model, messages: finalMessages, stream }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("DashScope error", upstream.status, text);
      const status =
        upstream.status === 429 ? 429 : upstream.status === 401 ? 401 : 500;
      const error =
        status === 429
          ? "Rate limit exceeded, please try again shortly."
          : status === 401
          ? "Invalid Alibaba Model Studio API key."
          : "AI provider error";
      return new Response(JSON.stringify({ error }), {
        status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (stream) {
      return new Response(upstream.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const json = await upstream.json();
    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-chat error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
