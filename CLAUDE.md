# CLAUDE.md — SheetSight

> Letakkan di **root** repo SheetSight. Claude Code membaca ini otomatis.

## Project
**SheetSight** — web app yang mengubah file Excel/CSV menjadi dashboard interaktif otomatis (KPI, grafik, tabel). Semua diproses di browser, tanpa backend. Spesifikasi lengkap di `PRD.md`.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- SheetJS (`xlsx`) — parsing Excel/CSV
- Recharts — grafik
- (P1) jspdf + html2canvas — ekspor PDF
- Deploy: Vercel

## Konvensi Kode
- Komponen fungsional + hooks; satu komponen per file di `src/components/`.
- File komponen `PascalCase.jsx`; util `camelCase.js`.
- Styling hanya via Tailwind utility.
- Logika parsing & deteksi tipe kolom dipisah di `src/lib/` (mis. `parseSheet.js`, `detectColumns.js`, `suggestCharts.js`) — murni & teruji, terpisah dari UI.
- State global via Context + reducer di `src/context/`.
- Format angka: `Intl.NumberFormat('id-ID')`.

## Struktur Folder
```
src/
  components/   # Dropzone, KpiCard, ChartPanel, DataTable, Navbar...
  context/      # data hasil parse + filter state
  lib/          # parseSheet, detectColumns, suggestCharts, formatters
  hooks/
  App.jsx
  main.jsx
  index.css
```

## Design Tokens (brand SheetSight)
- Dark default: bg `#0A0E1A`, surface `#151B2B`, surface2 `#1F2740`
- Aksen indigo `#4F46E5`→`#8B8CFB`; aksen2 cyan `#06B6D4`
- Font: Source Sans Pro (UI), JetBrains Mono (angka/label)
- Radius 14–20px; mobile-first; hit-target ≥ 44px; dukung light mode
- Acuan visual: `mockup-reference/`

## Aturan Penting
- **Semua proses di browser** — jangan kirim isi file ke server mana pun.
- Semua state async (parsing) wajib punya loading & error state.
- Tangani edge case: file kosong, semua kolom teks, angka berformat teks, file besar.
- Tulis `README.md`: deskripsi, screenshot, cara run, link demo.

## Definition of Done (MVP / P0)
- Upload → parse → KPI + 2 grafik + tabel sort/filter
- Tanpa error console; responsif 360px → desktop
- Lighthouse ≥ 90; live di Vercel + repo GitHub publik
