'use client';

import Icon from './Icon';
import { useTheme } from '@/context/ThemeContext';
import { useData } from '@/context/DataContext';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const { status, reset } = useData();
  const onDashboard = status === 'ready' || status === 'empty';

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-line backdrop-blur-md"
      style={{ background: 'color-mix(in srgb, var(--surface) 82%, transparent)' }}>
      <div className="mx-auto flex h-full w-full max-w-[1180px] items-center justify-between px-6">
        <button
          onClick={reset}
          className="flex items-center gap-3 text-lg font-bold"
          aria-label="SheetSight beranda"
        >
          <span className="grid h-9 w-9 place-items-center rounded-[11px] text-white"
            style={{ background: 'linear-gradient(135deg,var(--accent2),var(--accent))' }}>
            <Icon name="logo" size={21} />
          </span>
          SheetSight
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {!onDashboard && (
            <>
              <a href="#fitur" className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-muted transition hover:text-ink">Fitur</a>
              <a href="#cara" className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-muted transition hover:text-ink">Cara Kerja</a>
              <a href="#demo" className="rounded-lg px-3.5 py-2 text-[15px] font-medium text-muted transition hover:text-ink">Coba</a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggle}
            className="grid h-11 w-11 place-items-center rounded-xl border border-line text-muted transition hover:text-ink"
            aria-label={theme === 'dark' ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
            title="Ganti tema"
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
          {onDashboard ? (
            <button onClick={reset} className="btn btn-ghost">
              <Icon name="upload" size={18} /> File Baru
            </button>
          ) : (
            <a href="#demo" className="btn btn-primary">
              <Icon name="plus" size={18} /> Coba Gratis
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
