'use client';

import { useMemo, useState, useRef, useEffect } from 'react';
import Icon from './Icon';
import { useData } from '@/context/DataContext';

function CategoryFilter({ column, rows }) {
  const { filters, setFilter } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const options = useMemo(() => {
    const counts = new Map();
    for (const r of rows) {
      const v = r[column.name];
      if (v == null || v === '') continue;
      counts.set(String(v), (counts.get(String(v)) || 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 50);
  }, [rows, column.name]);

  const selected = filters[column.name];

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (options.length < 2) return null;

  const toggle = (val) => {
    const next = new Set(selected || []);
    next.has(val) ? next.delete(val) : next.add(val);
    setFilter(column.name, [...next]);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-[13.5px] font-medium transition hover:border-accent"
        style={selected?.size ? { borderColor: 'var(--accent)', color: 'var(--accent)' } : undefined}
      >
        <Icon name="filter" size={14} />
        {column.name}
        {selected?.size ? <span className="font-mono text-xs">· {selected.size}</span> : null}
      </button>
      {open && (
        <div className="absolute z-30 mt-2 max-h-72 w-60 overflow-y-auto rounded-xl border border-line p-2 shadow-soft scroll-thin"
          style={{ background: 'var(--surface)' }}>
          {options.map(([val, count]) => {
            const on = selected?.has(val);
            return (
              <button
                key={val}
                onClick={() => toggle(val)}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-[var(--surface2)]"
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="grid h-4 w-4 flex-shrink-0 place-items-center rounded border"
                    style={{
                      borderColor: on ? 'var(--accent)' : 'var(--border)',
                      background: on ? 'var(--accent)' : 'transparent',
                    }}
                  >
                    {on && <Icon name="check" size={11} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className="truncate">{val}</span>
                </span>
                <span className="font-mono text-[11px] text-muted">{count}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function FilterBar() {
  const { columns, rows, filters, clearFilters } = useData();
  const catCols = columns.filter((c) => c.type === 'category');
  const active = Object.keys(filters).length;

  if (!catCols.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <span className="font-mono text-xs uppercase tracking-wide text-muted">Filter:</span>
      {catCols.map((c) => (
        <CategoryFilter key={c.name} column={c} rows={rows} />
      ))}
      {active > 0 && (
        <button
          onClick={clearFilters}
          className="inline-flex items-center gap-1.5 text-[13px] text-muted transition hover:text-bad"
        >
          <Icon name="x" size={14} /> Hapus filter
        </button>
      )}
    </div>
  );
}
