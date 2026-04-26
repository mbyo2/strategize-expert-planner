import { saveAs } from 'file-saver';

const csvEscape = (v: any) => {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCsv = (rows: Record<string, any>[]) => {
  if (!rows.length) return '';
  const headers = Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );
  return [headers.join(','), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(','))].join('\n');
};

const safeName = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60) || 'board-pack';

export const exportBoardPackJSON = (pack: any) => {
  const blob = new Blob([JSON.stringify(pack.snapshot ?? {}, null, 2)], {
    type: 'application/json;charset=utf-8;',
  });
  saveAs(blob, `${safeName(pack.title)}-${new Date(pack.created_at).toISOString().split('T')[0]}.json`);
};

export const exportBoardPackCSV = (pack: any) => {
  const snap = pack.snapshot ?? {};
  const date = new Date(pack.created_at).toISOString().split('T')[0];
  const base = safeName(pack.title);

  // KPIs as a single-row CSV
  const kpis = snap.kpis ?? {};
  const kpiCsv = toCsv([{ pack_title: pack.title, period: pack.period_label ?? '', generated_at: snap.generated_at ?? pack.created_at, ...kpis }]);

  const goals = (snap.goals ?? []).map((g: any) => ({
    id: g.id,
    name: g.name,
    status: g.status,
    progress: g.progress,
    target_value: g.target_value,
    current_value: g.current_value,
    risk_level: g.risk_level,
    start_date: g.start_date,
    due_date: g.due_date,
  }));
  const goalsCsv = toCsv(goals);

  const decisions = (snap.decisions ?? []).map((d: any) => ({
    id: d.id,
    title: d.title,
    status: d.status,
    decision_type: d.decision_type,
    chosen_option: d.chosen_option_id,
    options_count: d.options?.length ?? 0,
    signoffs_count: d.signoffs?.length ?? 0,
    created_at: d.created_at,
    decided_at: d.decided_at,
  }));
  const decisionsCsv = toCsv(decisions);

  const bindings = (snap.bindings ?? []).map((b: any) => ({
    id: b.id,
    goal_id: b.goal_id,
    erp_module: b.erp_module,
    erp_metric: b.erp_metric,
    current_value: b.current_value,
    target_value: b.target_value,
    last_synced_at: b.last_synced_at,
  }));
  const bindingsCsv = toCsv(bindings);

  const combined =
    `# KPIs\n${kpiCsv}\n\n` +
    `# Goals (${goals.length})\n${goalsCsv}\n\n` +
    `# Decisions (${decisions.length})\n${decisionsCsv}\n\n` +
    `# ERP Bindings (${bindings.length})\n${bindingsCsv}\n`;

  const blob = new Blob([combined], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${base}-${date}.csv`);
};
