# Kickoff Prompt — SheetSight (siap tempel di Claude Code)

Cara pakai: buat folder kosong, taruh `CLAUDE.md` + `PRD.md` (dari bundle ini) + folder `mockup-reference/` di dalamnya. Buka di Claude Code, lalu tempel:

```
Bangun project "SheetSight" sesuai PRD.md.

SheetSight = web app yang mengubah file Excel/CSV jadi dashboard interaktif
otomatis (KPI, grafik, tabel). SEMUA proses di browser — tanpa backend, file
tidak diunggah ke server.

Stack: React 18 + Vite + Tailwind CSS + SheetJS (xlsx) untuk parsing + Recharts
untuk grafik. Ikuti design token di CLAUDE.md (dark default, aksen indigo→cyan,
Source Sans Pro + JetBrains Mono). Acuan visual ada di folder mockup-reference/.

Kerjakan fitur P0 dulu, berurutan:
1. Halaman upload: dropzone (drag-drop + klik), validasi .xlsx/.xls/.csv maks 10MB
2. Parsing pakai SheetJS + deteksi tipe tiap kolom (numerik/tanggal/kategori).
   Taruh logika ini di src/lib/ sebagai fungsi murni terpisah dari UI.
3. KPI cards otomatis (total, rata-rata, jumlah) dari kolom numerik utama
4. Minimal 2 grafik otomatis (bar/line untuk tren, donut untuk distribusi kategori)
5. Tabel data: sort per kolom, search global, pagination
6. Loading state (skeleton) + error state (file rusak/kosong/format salah)

Tangani edge case di PRD (file kosong, semua kolom teks, angka berformat teks,
file besar). Pakai data uji sederhana untuk verifikasi tiap langkah.

Berhenti & laporkan setelah P0 selesai & lolos Acceptance Criteria di PRD,
sebelum lanjut P1 (pilih kolom manual, filter, multi-sheet, ekspor PDF, light mode).

Akhiri dengan README repo (deskripsi + screenshot + cara run) dan langkah deploy
ke Vercel.

Mulai dari langkah 1 sekarang.
```

---

## Setelah SheetSight Live
Tautkan ke portfolio: buka `data.jsx` di repo portfolio, tambahkan SheetSight
sebagai project unggulan (taruh paling atas) dengan `demoUrl` (URL Vercel) +
`sourceUrl` (repo GitHub `nurfaisall`) + screenshot asli.
