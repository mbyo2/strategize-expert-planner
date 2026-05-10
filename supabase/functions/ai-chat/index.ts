// Alibaba Cloud Model Studio (DashScope) chat — OpenAI-compatible streaming
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const DASHSCOPE_URL =
  "https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions";

type ErrBody = {
  error: string;
  code: string;
  hint?: string;
  upstream_status?: number;
  upstream_body?: string;
};

const errResp = (status: number, body: ErrBody) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("DASHSCOPE_API_KEY");
    if (!apiKey) {
      return errResp(500, {
        error: "Server is missing DASHSCOPE_API_KEY",
        code: "MISSING_API_KEY",
        hint:
          "Add your Alibaba Model Studio API key as a Supabase secret named DASHSCOPE_API_KEY, then redeploy.",
      });
    }
    if (apiKey.length < 20) {
      return errResp(500, {
        error: "DASHSCOPE_API_KEY looks malformed",
        code: "INVALID_API_KEY_FORMAT",
        hint: "Keys typically start with 'sk-' and are >30 chars. Re-paste from Model Studio console.",
      });
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return errResp(400, {
        error: "Request body must be valid JSON",
        code: "BAD_JSON",
      });
    }

    const messages = Array.isArray(body?.messages) ? body.messages : null;
    if (!messages || messages.length === 0) {
      return errResp(400, {
        error: "messages array is required",
        code: "MISSING_MESSAGES",
      });
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

    let upstream: Response;
    try {
      upstream = await fetch(DASHSCOPE_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages: finalMessages, stream }),
      });
    } catch (e) {
      console.error("network error reaching DashScope", e);
      return errResp(502, {
        error: "Could not reach Alibaba Model Studio",
        code: "UPSTREAM_NETWORK_ERROR",
        hint:
          "Network failure between the edge function and dashscope-intl.aliyuncs.com. Try again; if it persists, check Alibaba status page.",
      });
    }

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("DashScope error", upstream.status, text);

      let code = "UPSTREAM_ERROR";
      let hint = "Check the upstream_body for the exact reason from Alibaba.";
      let status = 502;

      if (upstream.status === 401) {
        code = "INVALID_API_KEY";
        status = 401;
        hint =
          "Alibaba rejected the API key. Verify the key in Model Studio console (https://bailian.console.alibabacloud.com), make sure it has not been revoked, and that it's the international (dashscope-intl) key, not the China-only one.";
      } else if (upstream.status === 403) {
        code = "FORBIDDEN";
        status = 403;
        hint =
          "Key is valid but not authorised for this model. Open Model Studio → Model Activation and enable the Qwen model you selected, or switch to qwen-turbo.";
      } else if (upstream.status === 429) {
        code = "RATE_LIMITED";
        status = 429;
        hint =
          "You hit Alibaba's rate limit or your account has insufficient credits. Wait 30s, or top up at https://account.alibabacloud.com.";
      } else if (upstream.status === 400) {
        code = "BAD_REQUEST_TO_PROVIDER";
        status = 400;
        hint =
          "Alibaba rejected the request shape. Most likely the chosen model id is invalid for your account. Try qwen-turbo or qwen-plus.";
      } else if (upstream.status >= 500) {
        code = "PROVIDER_UNAVAILABLE";
        status = 503;
        hint = "Alibaba Model Studio is having issues. Retry shortly.";
      }

      return errResp(status, {
        error: "Alibaba Model Studio request failed",
        code,
        hint,
        upstream_status: upstream.status,
        upstream_body: text.slice(0, 800),
      });
    }

    if (stream) {
      return new Response(upstream.body, {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no",
        },
      });
    }

    const json = await upstream.json();
    return new Response(JSON.stringify(json), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-chat error", e);
    return errResp(500, {
      error: e instanceof Error ? e.message : "Unknown server error",
      code: "INTERNAL_ERROR",
      hint: "Check edge function logs for the stack trace.",
    });
  }
});
