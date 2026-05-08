// Generates a PDF for a board pack and uploads it to the `board-packs` bucket.
// Returns a short-lived signed URL.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString(); } catch { return d; }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) return jsonRes({ error: "Unauthorized" }, 401);

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // user-scoped client to verify and read with RLS
    const userClient = createClient(SUPABASE_URL, ANON, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claims, error: claimErr } = await userClient.auth.getClaims(token);
    if (claimErr || !claims?.claims?.sub) return jsonRes({ error: "Unauthorized" }, 401);

    const { packId } = await req.json().catch(() => ({}));
    if (!packId) return jsonRes({ error: "packId is required" }, 400);

    const { data: pack, error: packErr } = await userClient
      .from("board_packs")
      .select("*")
      .eq("id", packId)
      .maybeSingle();
    if (packErr) return jsonRes({ error: packErr.message }, 400);
    if (!pack) return jsonRes({ error: "Board pack not found" }, 404);

    // Build PDF
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const margin = 56;
    const pageWidth = 612;
    const pageHeight = 792;
    let page = doc.addPage([pageWidth, pageHeight]);
    let y = pageHeight - margin;

    const drawText = (text: string, opts: { size?: number; bold?: boolean; color?: any } = {}) => {
      const size = opts.size ?? 11;
      const f = opts.bold ? fontBold : font;
      const color = opts.color ?? rgb(0.1, 0.1, 0.15);
      const maxWidth = pageWidth - margin * 2;
      const words = String(text ?? "").split(/\s+/);
      let line = "";
      const flush = () => {
        if (y < margin + size + 4) {
          page = doc.addPage([pageWidth, pageHeight]);
          y = pageHeight - margin;
        }
        page.drawText(line, { x: margin, y, size, font: f, color });
        y -= size + 4;
        line = "";
      };
      for (const w of words) {
        const test = line ? line + " " + w : w;
        if (f.widthOfTextAtSize(test, size) > maxWidth) {
          flush();
          line = w;
        } else {
          line = test;
        }
      }
      if (line) flush();
    };

    const hr = () => {
      if (y < margin + 12) { page = doc.addPage([pageWidth, pageHeight]); y = pageHeight - margin; }
      page.drawLine({
        start: { x: margin, y },
        end: { x: pageWidth - margin, y },
        thickness: 0.5,
        color: rgb(0.8, 0.8, 0.85),
      });
      y -= 12;
    };

    drawText(pack.title || "Board Pack", { size: 22, bold: true });
    if (pack.period_label) drawText(`Period: ${pack.period_label}`, { size: 11, color: rgb(0.4,0.4,0.45) });
    drawText(`Generated: ${fmtDate(pack.created_at)}  ·  Status: ${pack.status ?? "draft"}`, { size: 10, color: rgb(0.4,0.4,0.45) });
    hr();

    if (pack.notes) {
      drawText("Notes", { size: 14, bold: true });
      drawText(pack.notes);
      y -= 6;
    }

    const goals: any[] = Array.isArray(pack.goals_snapshot) ? pack.goals_snapshot : [];
    const decisions: any[] = Array.isArray(pack.decisions_snapshot) ? pack.decisions_snapshot : [];
    const kpis: any[] = Array.isArray(pack.kpis_snapshot) ? pack.kpis_snapshot : [];

    drawText(`Strategic Goals (${goals.length})`, { size: 14, bold: true });
    if (goals.length === 0) drawText("No goals captured.", { color: rgb(0.5,0.5,0.55) });
    for (const g of goals.slice(0, 50)) {
      drawText(`• ${g.title ?? "Untitled goal"}`, { bold: true });
      const meta = [g.status, g.progress != null ? `${g.progress}% progress` : null].filter(Boolean).join("  ·  ");
      if (meta) drawText(`   ${meta}`, { size: 10, color: rgb(0.45,0.45,0.5) });
      if (g.description) drawText(`   ${g.description}`, { size: 10 });
    }
    y -= 6;

    drawText(`Decisions (${decisions.length})`, { size: 14, bold: true });
    if (decisions.length === 0) drawText("No decisions captured.", { color: rgb(0.5,0.5,0.55) });
    for (const d of decisions.slice(0, 50)) {
      drawText(`• ${d.title ?? "Decision"}`, { bold: true });
      const meta = [d.status, d.decided_at ? fmtDate(d.decided_at) : null].filter(Boolean).join("  ·  ");
      if (meta) drawText(`   ${meta}`, { size: 10, color: rgb(0.45,0.45,0.5) });
      if (d.summary) drawText(`   ${d.summary}`, { size: 10 });
    }
    y -= 6;

    if (kpis.length > 0) {
      drawText(`KPIs (${kpis.length})`, { size: 14, bold: true });
      for (const k of kpis.slice(0, 50)) {
        drawText(`• ${k.name ?? "KPI"}: ${k.value ?? "—"}${k.unit ? " " + k.unit : ""}`);
      }
    }

    const pdfBytes = await doc.save();

    // Upload using service role (RLS check already done via select above)
    const admin = createClient(SUPABASE_URL, SERVICE);
    const orgId = pack.organization_id || "shared";
    const path = `${orgId}/${pack.id}/${Date.now()}-board-pack.pdf`;

    const { error: upErr } = await admin.storage
      .from("board-packs")
      .upload(path, pdfBytes, { contentType: "application/pdf", upsert: false });
    if (upErr) return jsonRes({ error: upErr.message }, 500);

    const { data: signed, error: signErr } = await admin.storage
      .from("board-packs")
      .createSignedUrl(path, 60 * 10);
    if (signErr) return jsonRes({ error: signErr.message }, 500);

    // best-effort: persist last pdf path on the pack row
    await admin.from("board_packs").update({ pdf_path: path } as any).eq("id", pack.id);

    return jsonRes({ url: signed.signedUrl, path, expires_in: 600 });
  } catch (e: any) {
    console.error("generate-board-pack-pdf error", e);
    return jsonRes({ error: e?.message || "Internal error" }, 500);
  }
});
