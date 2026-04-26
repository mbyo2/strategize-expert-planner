import { saveAs } from 'file-saver';

const csvEscape = (v: any) => {
  if (v === null || v === undefined) return '';
  const s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCsv = (rows: Record<string, any>[]) => {
  if (!rows.length) return '';
  const headerSet = new Set<string>();
  rows.forEach((r) => Object.keys(r).forEach((k) => headerSet.add(k)));
  const headers = Array.from(headerSet);
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

/**
 * Excel-friendly flat CSV: one row per item across all entity kinds, with a
 * single consistent column schema. Each row represents exactly one KPI, goal,
 * decision, or ERP binding. Empty cells are used where a field doesn't apply.
 */
export const exportBoardPackFlatCSV = (pack: any) => {
  const snap = pack.snapshot ?? {};
  const date = new Date(pack.created_at).toISOString().split('T')[0];
  const base = safeName(pack.title);
  const generatedAt = snap.generated_at ?? pack.created_at;

  type Row = {
    pack_title: string;
    period: string;
    generated_at: string;
    entity_type: 'kpi' | 'goal' | 'decision' | 'binding';
    entity_id: string;
    name: string;
    status: string;
    metric: string;
    current_value: string | number;
    target_value: string | number;
    progress: string | number;
    risk_level: string;
    decision_type: string;
    chosen_option: string;
    options_count: string | number;
    signoffs_count: string | number;
    erp_module: string;
    goal_id: string;
    last_synced_at: string;
    start_date: string;
    due_date: string;
    decided_at: string;
    created_at: string;
  };

  const blank: Omit<Row, 'pack_title' | 'period' | 'generated_at' | 'entity_type'> = {
    entity_id: '', name: '', status: '', metric: '',
    current_value: '', target_value: '', progress: '', risk_level: '',
    decision_type: '', chosen_option: '', options_count: '', signoffs_count: '',
    erp_module: '', goal_id: '', last_synced_at: '',
    start_date: '', due_date: '', decided_at: '', created_at: '',
  };

  const meta = {
    pack_title: pack.title,
    period: pack.period_label ?? '',
    generated_at: generatedAt,
  };

  const rows: Row[] = [];

  Object.entries(snap.kpis ?? {}).forEach(([k, v]) => {
    rows.push({ ...meta, entity_type: 'kpi', ...blank, entity_id: k, name: k, metric: k, current_value: v as any });
  });

  (snap.goals ?? []).forEach((g: any) => {
    rows.push({
      ...meta, entity_type: 'goal', ...blank,
      entity_id: g.id ?? '', name: g.name ?? '', status: g.status ?? '',
      current_value: g.current_value ?? '', target_value: g.target_value ?? '',
      progress: g.progress ?? '', risk_level: g.risk_level ?? '',
      start_date: g.start_date ?? '', due_date: g.due_date ?? '',
    });
  });

  (snap.decisions ?? []).forEach((d: any) => {
    rows.push({
      ...meta, entity_type: 'decision', ...blank,
      entity_id: d.id ?? '', name: d.title ?? '', status: d.status ?? '',
      decision_type: d.decision_type ?? '', chosen_option: d.chosen_option_id ?? '',
      options_count: d.options?.length ?? 0, signoffs_count: d.signoffs?.length ?? 0,
      created_at: d.created_at ?? '', decided_at: d.decided_at ?? '',
    });
  });

  (snap.bindings ?? []).forEach((b: any) => {
    rows.push({
      ...meta, entity_type: 'binding', ...blank,
      entity_id: b.id ?? '', name: b.erp_metric ?? '', metric: b.erp_metric ?? '',
      current_value: b.current_value ?? '', target_value: b.target_value ?? '',
      erp_module: b.erp_module ?? '', goal_id: b.goal_id ?? '',
      last_synced_at: b.last_synced_at ?? '',
    });
  });

  const csv = toCsv(rows as unknown as Record<string, any>[]);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${base}-${date}-flat.csv`);
};
