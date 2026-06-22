'use client';

export default function LoadingSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="skeleton h-10 w-10" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-44" />
          <div className="skeleton h-3 w-28" />
        </div>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-24" />
        ))}
      </div>
      <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[1.5fr_1fr]">
        <div className="skeleton h-[280px]" />
        <div className="skeleton h-[280px]" />
      </div>
      <div className="skeleton h-72" />
      <p className="mt-6 text-center font-mono text-sm text-muted">
        Membaca & menganalisis file… semuanya di browser kamu.
      </p>
    </div>
  );
}
