'use client';

import Icon from './Icon';
import { useData } from '@/context/DataContext';

export default function ErrorState({ message }) {
  const { reset } = useData();
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-6 py-24 text-center">
      <span
        className="mb-5 grid h-16 w-16 place-items-center rounded-2xl text-bad"
        style={{ background: 'color-mix(in srgb, var(--red) 14%, var(--surface))' }}
      >
        <Icon name="x" size={32} strokeWidth={2.5} />
      </span>
      <h2 className="text-2xl">File tidak bisa diproses</h2>
      <p className="mt-3 max-w-md text-muted">{message}</p>
      <button onClick={reset} className="btn btn-primary mt-7">
        <Icon name="refresh" size={18} /> Coba file lain
      </button>
    </div>
  );
}
