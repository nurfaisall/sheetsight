'use client';

import { formatCompact, formatNumber } from '@/lib/formatters';

export default function KpiCard({ label, value, kind }) {
  const display =
    kind === 'count' ? formatNumber(value) : formatCompact(value);
  const full = kind === 'count' ? null : formatNumber(value);

  return (
    <div className="rounded-xl border border-line p-[18px]" style={{ background: 'var(--bg)' }}>
      <div className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{label}</div>
      <div
        className="mt-2 font-mono text-[26px] font-extrabold tracking-[-0.02em]"
        title={full || undefined}
      >
        {kind === 'count' ? display : <><span className="text-muted">Rp </span>{display}</>}
      </div>
    </div>
  );
}
