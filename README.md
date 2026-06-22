# SheetSight

> **Upload file Excel/CSV → dashboard interaktif otomatis** (KPI, grafik, tabel). Semua diproses **di browser** — file kamu tidak pernah dikirim ke server mana pun.

SheetSight membaca file `.xlsx` / `.xls` / `.csv`, mendeteksi tipe tiap kolom (angka, tanggal, kategori), lalu otomatis membangun KPI, grafik, dan tabel interaktif. Tanpa rumus, tanpa bikin pivot/chart manual.

<!-- Setelah deploy: simpan screenshot dashboard sebagai docs/screenshot.png,
     lalu hapus komentar ini agar gambar di bawah tampil. -->
<!-- ![SheetSight — dashboard otomatis dari file Excel/CSV](docs/screenshot.png) -->

> 📸 _Screenshot menyusul setelah app live di Vercel._

---

## ✨ Fitur

- **Upload** drag-drop + klik · validasi tipe & ukuran (maks 10 MB)
- **Deteksi kolom otomatis** — numerik / tanggal / kategori (≥80% sampel)
- **KPI cards otomatis** — Total, Rata-rata, Jumlah baris, Maks dari metrik utama
- **Grafik otomatis** — tren waktu (line), per kategori (bar), distribusi (donut)
- **Tabel data** — sort per kolom, search global, pagination, pill status
- **Filter kategori** — KPI & grafik ikut tersaring real-time
- **Multi-sheet** — pilih sheet bila workbook punya banyak sheet
- **Ekspor PDF** — unduh dashboard sebagai PDF
- **Tema gelap/terang** — toggle, tersimpan di localStorage
- **Loading & error state** — skeleton saat parsing; pesan jelas saat gagal

## 🧱 Tech Stack

- **Next.js 14** (App Router) + **React 18**
- **Tailwind CSS** — styling via utility + CSS variables (design token)
- **SheetJS (`xlsx`)** — parsing Excel/CSV di browser
- **Recharts** — grafik
- **jsPDF + html2canvas** — ekspor PDF (dimuat dinamis)
- Tanpa backend · siap deploy ke **Vercel**

## 🚀 Cara Run

```bash
git clone https://github.com/nurfaisall/sheetsight.git
cd sheetsight
npm install
npm run dev      # http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

Belum punya file? Klik **"Coba data contoh"** di kartu upload — memuat
`public/contoh-penjualan.csv`.

## 📁 Struktur

```
src/
  app/            # layout, page, globals.css (App Router)
  components/     # Navbar, Dropzone, KpiCard, ChartPanel, DataTable, FilterBar, Dashboard, Landing...
  context/        # DataContext (parse + filter), ThemeContext
  hooks/          # useExportPdf
  lib/            # parseSheet, detectColumns, suggestCharts, formatters (logika murni)
public/
  contoh-penjualan.csv
```

Logika inti (parsing & deteksi) berada di `src/lib/` — murni, terpisah dari UI.

## 🔒 Privasi

Semua perhitungan terjadi di browser. Tidak ada request jaringan yang membawa isi
file kamu — cek tab **Network** untuk membuktikannya (NFR di PRD).

## ☁️ Deploy

Push ke GitHub → import di [Vercel](https://vercel.com) → deploy (preset Next.js,
tanpa konfigurasi tambahan).

- **Live demo:** _(isi URL Vercel setelah deploy, mis. `https://sheetsight.vercel.app`)_
- **Repo:** https://github.com/nurfaisall/sheetsight

---

Dirancang oleh **Nur Faizal Khusayiri Saldan**. Spesifikasi lengkap di [`PRD.md`](PRD.md).
