'use client';

import { useMemo, useState } from 'react';
import Icon from './Icon';
import { formatCell } from '@/lib/formatters';

const PAGE_SIZE = 10;
const STATUS_RE = /(lunas|selesai|paid|done|aktif|active|success)/i;
const WARN_RE = /(pending|proses|menunggu|process|waiting)/i;

function StatusPill({ value }) {
  const v = String(value);
  if (STATUS_RE.test(v))
    return <span className="rounded-full px-2.5 py-0.5 font-mono text-[11.5px] font-semibold" style={{ background: 'color-mix(in srgb, var(--green) 16%, transparent)', color: 'var(--green)' }}>{v}</span>;
  if (WARN_RE.test(v))
    return <span className="rounded-full px-2.5 py-0.5 font-mono text-[11.5px] font-semibold" style={{ background: 'color-mix(in srgb, var(--amber) 16%, transparent)', color: 'var(--amber)' }}>{v}</span>;
  return v;
}

export default function DataTable({ columns, rows }) {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState({ key: null, dir: 'asc' });
  const [page, setPage] = useState(0);

  const isStatusCol = (name) => /status|state|kondisi/i.test(name);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      columns.some((c) => formatCell(r[c.name], c.type).toLowerCase().includes(q))
    );
  }, [rows, query, columns]);

  const sorted = useMemo(() => {
    if (!sort.key) return filtered;
    const col = columns.find((c) => c.name === sort.key);
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      let av = a[sort.key];
      let bv = b[sort.key];
      if (av == null || av === '') return 1;
      if (bv == null || bv === '') return -1;
      if (col?.type === 'number') return (av - bv) * dir;
      if (col?.type === 'date') return (av.getTime() - bv.getTime()) * dir;
      return String(av).localeCompare(String(bv), 'id') * dir;
    });
  }, [filtered, sort, columns]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const toggleSort = (key) => {
    setPage(0);
    setSort((s) =>
      s.key === key
        ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' }
        : { key, dir: 'asc' }
    );
  };

  return (
    <div className="rounded-xl border border-line" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-3.5">
        <h4 className="text-[14.5px]">Tabel Data <span className="font-mono text-xs text-muted">· {sorted.length} baris</span></h4>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted">
            <Icon name="search" size={16} />
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(0);
            }}
            placeholder="Cari di semua kolom…"
            className="h-10 w-full rounded-lg border border-line bg-transparent pl-9 pr-3 text-sm outline-none transition focus:border-accent sm:w-64"
          />
        </div>
      </div>

      <div className="scroll-thin overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort.key === c.name;
                return (
                  <th
                    key={c.name}
                    onClick={() => toggleSort(c.name)}
                    className="cursor-pointer select-none whitespace-nowrap border-b border-line px-3.5 py-3 text-left font-mono text-[11.5px] font-semibold uppercase tracking-[0.05em] text-muted transition hover:text-ink"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {c.name}
                      <Icon
                        name={active ? (sort.dir === 'asc' ? 'arrowUp' : 'arrowDown') : 'sort'}
                        size={13}
                        className={active ? 'text-accent' : 'opacity-50'}
                      />
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted">
                  Tidak ada baris yang cocok.
                </td>
              </tr>
            ) : (
              pageRows.map((r, ri) => (
                <tr key={ri} className="transition hover:bg-[var(--surface)]">
                  {columns.map((c) => (
                    <td
                      key={c.name}
                      className={`whitespace-nowrap border-b border-line px-3.5 py-3 ${
                        c.type === 'number' ? 'font-mono' : ''
                      }`}
                    >
                      {isStatusCol(c.name) ? (
                        <StatusPill value={r[c.name]} />
                      ) : (
                        formatCell(r[c.name], c.type)
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-line p-3.5 text-sm">
          <span className="font-mono text-xs text-muted">
            Halaman {safePage + 1} / {pageCount}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={safePage === 0}
              className="rounded-lg border border-line px-3 py-1.5 transition enabled:hover:border-accent disabled:opacity-40"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              disabled={safePage >= pageCount - 1}
              className="rounded-lg border border-line px-3 py-1.5 transition enabled:hover:border-accent disabled:opacity-40"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
