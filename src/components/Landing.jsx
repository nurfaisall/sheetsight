'use client';

import Icon from './Icon';
import Dropzone from './Dropzone';

const features = [
  {
    icon: 'zap',
    title: 'Instan, bukan jam-jaman',
    desc: 'Tak perlu bikin pivot & chart manual tiap bulan. Upload sekali, dashboard langsung jadi.',
  },
  {
    icon: 'grid',
    title: 'Deteksi kolom otomatis',
    desc: 'Tahu mana angka, tanggal, dan kategori — lalu menyarankan grafik yang paling pas.',
  },
  {
    icon: 'shield',
    title: 'Aman & privat',
    desc: 'Semua diproses di browser kamu. File tidak pernah diunggah ke server mana pun.',
  },
];

const steps = [
  { n: '01', title: 'Upload', desc: 'Seret file Excel atau CSV ke halaman. Tidak perlu daftar.' },
  { n: '02', title: 'SheetSight membaca', desc: 'Data dipindai, kolom dikenali, grafik terbaik disarankan otomatis.' },
  { n: '03', title: 'Lihat & filter', desc: 'Dapat dashboard interaktif. Filter, urutkan, cari, ganti sheet, ekspor PDF.' },
];

export default function Landing() {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden px-0 pb-16 pt-20">
        <div
          className="pointer-events-none absolute -right-40 -top-64 h-[680px] w-[680px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 68%)',
          }}
        />
        <div className="relative z-10 mx-auto grid w-full max-w-[1180px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[13px] font-semibold text-accent"
              style={{
                background: 'color-mix(in srgb, var(--accent) 12%, var(--surface))',
                borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
              }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: 'var(--green)', boxShadow: '0 0 0 3px color-mix(in srgb, var(--green) 30%, transparent)' }} />
              100% jalan di browser · tanpa upload ke server
            </span>
            <h1 className="mt-5 text-[clamp(34px,5.2vw,56px)]">
              File Excel jadi{' '}
              <span
                style={{
                  background: 'linear-gradient(120deg,var(--accent),var(--cyan))',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                dashboard
              </span>
              , dalam hitungan detik.
            </h1>
            <p className="mt-5 max-w-[520px] text-[19px] text-muted">
              Seret file <b>.xlsx</b> atau <b>.csv</b> — SheetSight otomatis membaca datanya
              dan membuat KPI, grafik, dan tabel interaktif. Tanpa rumus, tanpa bikin chart manual.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="#demo" className="btn btn-primary">
                <Icon name="upload" size={18} /> Upload File Saya
              </a>
              <a href="#fitur" className="btn btn-ghost">Lihat Fitur</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
              <span className="inline-flex items-center gap-2"><Icon name="upload" size={17} className="text-accent" /> Upload</span>
              <span className="opacity-40">→</span>
              <span className="inline-flex items-center gap-2"><Icon name="spark" size={17} className="text-accent" /> Otomatis dibaca</span>
              <span className="opacity-40">→</span>
              <span className="inline-flex items-center gap-2"><Icon name="logo" size={17} className="text-accent" /> Dashboard jadi</span>
            </div>
          </div>

          <div className="animate-fade-up" id="demo">
            <Dropzone />
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section className="px-0 py-20" id="fitur">
        <div className="mx-auto w-full max-w-[1180px] px-6">
          <span className="eyebrow">Kenapa SheetSight</span>
          <h2 className="mt-4 text-[clamp(28px,3.6vw,40px)]">Hemat jam kerja tiap minggu</h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="card transition hover:-translate-y-1.5"
                style={{ borderRadius: 16 }}
              >
                <span
                  className="mb-4 grid h-12 w-12 place-items-center rounded-[13px] text-accent"
                  style={{ background: 'color-mix(in srgb, var(--accent) 14%, var(--surface))' }}
                >
                  <Icon name={f.icon} size={24} />
                </span>
                <h3 className="text-[19px]">{f.title}</h3>
                <p className="mt-2 text-[14.5px] text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CARA KERJA */}
      <section
        className="px-0 py-20"
        id="cara"
        style={{
          background:
            'linear-gradient(180deg,transparent,color-mix(in srgb,var(--accent) 4%,var(--bg)))',
        }}
      >
        <div className="mx-auto w-full max-w-[1180px] px-6">
          <span className="eyebrow">Cara Kerja</span>
          <h2 className="mt-4 text-[clamp(28px,3.6vw,40px)]">Tiga langkah, selesai</h2>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="card relative overflow-hidden" style={{ borderRadius: 16 }}>
                <span
                  className="absolute right-5 top-3 text-[46px] font-extrabold"
                  style={{ color: 'color-mix(in srgb, var(--accent) 18%, transparent)' }}
                >
                  {s.n}
                </span>
                <h3 className="mt-1.5 text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mb-20 px-0">
        <div className="mx-auto w-full max-w-[1180px] px-6">
          <div
            className="rounded-[22px] border px-10 py-14 text-center"
            style={{
              background:
                'linear-gradient(135deg,color-mix(in srgb,var(--accent2) 22%,var(--surface)),var(--surface))',
              borderColor: 'color-mix(in srgb, var(--accent) 30%, transparent)',
            }}
          >
            <h2 className="text-[clamp(26px,3.4vw,38px)]">Punya file Excel yang berantakan?</h2>
            <p className="mx-auto mt-3.5 max-w-[480px] text-lg text-muted">
              Ubah jadi dashboard rapi dalam hitungan detik. Gratis, tanpa daftar.
            </p>
            <div className="mt-7 flex justify-center">
              <a href="#demo" className="btn btn-primary">
                <Icon name="upload" size={18} /> Mulai Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-7">
        <div className="mx-auto flex w-full max-w-[1180px] flex-wrap items-center justify-between gap-3.5 px-6 text-sm text-muted">
          <div className="flex items-center gap-2.5 text-base font-bold text-ink">
            <span className="grid h-8 w-8 place-items-center rounded-[9px] text-white"
              style={{ background: 'linear-gradient(135deg,var(--accent2),var(--accent))' }}>
              <Icon name="logo" size={18} />
            </span>
            SheetSight
          </div>
          <span className="text-[12.5px]">
            Dibuat dengan Next.js + Tailwind · dirancang oleh Nur Faizal Khusayiri Saldan
          </span>
        </div>
      </footer>
    </main>
  );
}
