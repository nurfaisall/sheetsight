'use client';

import { useMemo, useRef } from 'react';
import Icon from './Icon';
import KpiCard from './KpiCard';
import ChartPanel from './ChartPanel';
import DataTable from './DataTable';
import FilterBar from './FilterBar';
import { useData } from '@/context/DataContext';
import { useExportPdf } from '@/hooks/useExportPdf';
import { buildKpis, suggestCharts } from '@/lib/suggestCharts';
import { formatNumber } from '@/lib/formatters';

export default function Dashboard() {
  const { file, columns, filteredRows, rows, sheets, activeSheet, selectSheet, filters } =
    useData();
  const captureRef = useRef(null);
  const { exportPdf, exporting } = useExportPdf();

  const { cards } = useMemo(() => buildKpis(filteredRows, columns), [filteredRows, columns]);
  const charts = useMemo(() => suggestCharts(filteredRows, columns), [filteredRows, columns]);

  const trend = charts.find((c) => c.id === 'trend' || c.id === 'bar-cat');
  const donut = charts.find((c) => c.id === 'donut');
  const filtersActive = Object.keys(filters).length > 0;

  const typeSummary = useMemo(() => {
    const n = columns.filter((c) => c.type === 'number').length;
    const d = columns.filter((c) => c.type === 'date').length;
    const c = columns.filter((c) => c.type === 'category').length;
    return `${columns.length} kolom · ${n} angka, ${d} tanggal, ${c} kategori`;
  }, [columns]);

  return (
    <main className="mx-auto w-full max-w-[1180px] px-6 py-8">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[10px] text-ok"
            style={{ background: 'color-mix(in srgb, var(--green) 18%, var(--surface))' }}>
            <Icon name="file" size={21} />
          </span>
          <div>
            <div className="text-base font-bold">{file?.name || 'data'}</div>
            <div className="font-mono text-[12.5px] text-muted">
              {formatNumber(rows.length)} baris · {typeSummary}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {sheets.length > 1 && (
            <div className="flex items-center gap-1 rounded-xl border border-line p-1" style={{ background: 'var(--bg)' }}>
              {sheets.map((s) => (
                <button
                  key={s}
                  onClick={() => selectSheet(s)}
                  className="rounded-lg px-3 py-1.5 text-[13px] font-semibold transition"
                  style={
                    s === activeSheet
                      ? { background: 'linear-gradient(135deg,var(--accent2),var(--accent))', color: '#fff' }
                      : { color: 'var(--muted)' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => exportPdf(captureRef.current, file?.name)}
            disabled={exporting}
            className="btn btn-ghost disabled:opacity-60"
          >
            {exporting ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-accent" />
            ) : (
              <Icon name="download" size={18} />
            )}
            {exporting ? 'Menyiapkan…' : 'Ekspor PDF'}
          </button>
        </div>
      </div>

      <div className="mb-5">
        <FilterBar />
      </div>

      {filtersActive && filteredRows.length === 0 ? (
        <div className="rounded-xl border border-line p-12 text-center text-muted" style={{ background: 'var(--bg)' }}>
          Tidak ada baris yang cocok dengan filter. Sesuaikan atau hapus filter.
        </div>
      ) : (
        <div ref={captureRef} className="space-y-5">
          {/* KPI */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {cards.map((c, i) => (
              <KpiCard key={i} {...c} />
            ))}
          </div>

          {/* Charts */}
          {(trend || donut) && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_1fr]">
              {trend && <ChartPanel chart={trend} />}
              {donut && <ChartPanel chart={donut} />}
            </div>
          )}

          {/* Table */}
          <DataTable columns={columns} rows={filteredRows} />
        </div>
      )}

      <p className="mt-6 text-center font-mono text-xs text-muted">
        🔒 Semua perhitungan terjadi di browser ini — tidak ada data yang dikirim ke server.
      </p>
    </main>
  );
}
