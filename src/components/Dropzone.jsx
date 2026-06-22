'use client';

import { useRef, useState, useCallback } from 'react';
import Icon from './Icon';
import { useData } from '@/context/DataContext';
import { formatBytes } from '@/lib/formatters';

export default function Dropzone() {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const { loadFile, file, status } = useData();

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files?.[0];
      if (f) loadFile(f);
    },
    [loadFile]
  );

  const onPick = useCallback(
    (e) => {
      const f = e.target.files?.[0];
      if (f) loadFile(f);
      e.target.value = ''; // izinkan upload file sama lagi
    },
    [loadFile]
  );

  const loadSample = useCallback(async () => {
    try {
      const res = await fetch('/contoh-penjualan.csv');
      const blob = await res.blob();
      loadFile(new File([blob], 'contoh-penjualan.csv', { type: 'text/csv' }));
    } catch {
      /* abaikan */
    }
  }, [loadFile]);

  return (
    <div className="card shadow-soft" style={{ borderRadius: 20 }}>
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-[0.08em] text-muted">
          SheetSight · Upload
        </span>
        <span className="flex gap-1.5">
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#ff5f57' }} />
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#febc2e' }} />
          <i className="h-2.5 w-2.5 rounded-full" style={{ background: '#28c840' }} />
        </span>
      </div>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="cursor-pointer rounded-[15px] border-2 border-dashed px-6 py-9 text-center transition"
        style={{
          borderColor: dragging
            ? 'var(--accent)'
            : 'color-mix(in srgb, var(--accent) 40%, var(--border))',
          background: dragging
            ? 'color-mix(in srgb, var(--accent) 12%, var(--surface2))'
            : 'color-mix(in srgb, var(--accent) 5%, var(--surface2))',
        }}
      >
        <div className="mx-auto mb-4 grid h-[62px] w-[62px] place-items-center rounded-2xl text-white"
          style={{ background: 'linear-gradient(135deg,var(--accent2),var(--accent))' }}>
          <Icon name="upload" size={30} />
        </div>
        <h3 className="text-[19px]">Seret file ke sini</h3>
        <p className="mt-1.5 text-sm text-muted">
          atau klik untuk pilih — .xlsx, .xls, .csv (maks. 10 MB)
        </p>
        <button type="button" className="btn btn-primary mt-4" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}>
          Pilih File
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={onPick}
        />
      </div>

      <button
        type="button"
        onClick={loadSample}
        className="mt-3 w-full text-center font-mono text-xs text-muted transition hover:text-accent"
      >
        Belum punya file? Coba data contoh →
      </button>

      {file && status !== 'error' && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-line p-3"
          style={{ background: 'var(--surface2)' }}>
          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-[9px] text-ok"
            style={{ background: 'color-mix(in srgb, var(--green) 18%, var(--surface))' }}>
            <Icon name="file" size={19} />
          </span>
          <div className="flex-1 overflow-hidden">
            <div className="truncate text-[14.5px] font-semibold">{file.name}</div>
            <div className="font-mono text-[12.5px] text-muted">{formatBytes(file.size)}</div>
          </div>
          {status === 'loading' ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-accent" />
          ) : (
            <span className="text-ok"><Icon name="check" size={20} strokeWidth={2.5} /></span>
          )}
        </div>
      )}
    </div>
  );
}
