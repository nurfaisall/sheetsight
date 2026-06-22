# PRD — SheetSight

> **Owner:** Nur Faizal Khusayiri Saldan
> **Status:** Draft v1 · **Kategori:** Web App (flagship) · **Estimasi:** 2–3 minggu

---

## 1. Ringkasan Produk

### Masalah
Banyak orang (admin, pemilik UMKM, mahasiswa) menyimpan data di Excel/CSV, lalu **berulang kali membuat pivot & grafik manual** tiap kali butuh laporan — memakan waktu dan membosankan. Tidak semua orang paham rumus & PivotTable.

### Solusi
SheetSight: **upload file Excel/CSV → dashboard interaktif otomatis**. Aplikasi membaca data, mendeteksi tipe kolom, menyarankan grafik yang cocok, lalu menampilkan KPI, grafik, dan tabel. Semua diproses **di browser** (privat, tanpa server).

### Target User
- Pemilik UMKM / admin yang butuh laporan cepat tanpa ribet rumus.
- Mahasiswa / analis pemula yang ingin visualisasi instan.

### Tujuan / Success Metrics
| Metrik | Target |
|---|---|
| Waktu upload → dashboard tampil | < 5 detik (file < 5 MB) |
| Akurasi deteksi tipe kolom | ≥ 90% kasus umum |
| Lighthouse Performance | ≥ 90 |
| Proses data | 100% di browser (privasi) |

---

## 2. Fitur

### P0 — Wajib (MVP)
- **F-01 Upload File** — drag-drop + klik pilih; dukung `.xlsx`, `.xls`, `.csv` (maks 10 MB). Validasi tipe & ukuran.
- **F-02 Parsing & Deteksi Kolom** — baca sheet pertama; deteksi tiap kolom: **numerik / tanggal / kategori (teks)**.
- **F-03 KPI Cards Otomatis** — dari kolom numerik utama: Total, Rata-rata, Jumlah baris, (opsional) Max/Min.
- **F-04 Grafik Otomatis** — minimal 2: (a) bar/line untuk numerik per tanggal/kategori, (b) donut untuk distribusi kategori. Aplikasi memilih kombinasi terbaik.
- **F-05 Tabel Data** — tampilkan semua baris; sort per kolom, search global, pagination.
- **F-06 Loading & Error State** — skeleton saat parsing; pesan jelas bila file rusak/format tak didukung/kosong.

### P1 — Penting
- **F-07 Pilih Kolom Manual** — user ubah kolom sumbu X/Y & jenis grafik (override saran otomatis).
- **F-08 Filter Data** — filter berdasarkan nilai kategori; semua KPI & grafik ikut tersaring.
- **F-09 Multi-sheet** — bila workbook punya banyak sheet, user bisa pilih sheet.
- **F-10 Ekspor PDF** — unduh dashboard sebagai PDF.
- **F-11 Tema Terang/Gelap** — toggle (selaras brand SheetSight).

### P2 — Nice to have
- **F-12 Bagikan Link** — simpan state ke URL / localStorage untuk dibuka ulang.
- **F-13 Ringkasan Otomatis** — insight teks ("Penjualan naik 12% di Juni").
- **F-14 Drag-drop atur layout** dashboard.
- **F-15 Pilih beberapa file / gabung data.**

---

## 3. User Flow Utama
1. Buka app → halaman upload (dropzone besar + contoh).
2. Drag file `.xlsx`/`.csv` → validasi → parsing (loading state).
3. Deteksi kolom → render dashboard: KPI cards + grafik + tabel.
4. (P1) User filter / ganti kolom / pilih sheet → dashboard update real-time.
5. (P1) Ekspor PDF atau (P2) bagikan link.

**Edge cases:** file kosong / hanya header (pesan "data tidak cukup"); semua kolom teks (skip KPI numerik, tetap tampilkan tabel + distribusi kategori); angka berformat teks (coba parse); file > 10 MB (tolak dgn pesan); banyak kolom (tabel horizontal scroll).

---

## 4. Data & Deteksi (logika inti)
```
Untuk tiap kolom:
  - sampel N baris pertama
  - jika ≥80% bisa di-Number() → numerik
  - else jika ≥80% cocok pola tanggal (Date.parse / regex) → tanggal
  - else → kategori (teks)

Pemilihan grafik:
  - ada (tanggal + numerik) → line/bar tren waktu
  - ada (kategori + numerik) → bar per kategori + donut distribusi
  - hanya kategori → donut/bar count per nilai
KPI: ambil kolom numerik dgn variasi tertinggi sebagai "metrik utama".
```

Gunakan **SheetJS**: `XLSX.read(arrayBuffer)` → `XLSX.utils.sheet_to_json(sheet, { header: 1 })`.

---

## 5. Tech Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Parsing:** SheetJS (`xlsx`)
- **Grafik:** Recharts (atau Chart.js)
- **PDF (P1):** `html2canvas` + `jspdf` atau `react-to-print`
- **State:** Context + `useReducer`; data hasil parse di memori
- **Deploy:** Vercel · **No backend**

---

## 6. Design Language (brand SheetSight)
- **Tema:** dark default (`#0A0E1A` bg, `#151B2B` surface), dukung light.
- **Aksen:** indigo `#4F46E5` → `#8B8CFB` (gradient), aksen kedua cyan `#06B6D4`.
- **Font:** Source Sans Pro (UI) + JetBrains Mono (angka/kode/label).
- **Komponen:** dropzone besar, KPI card, panel grafik, tabel dengan pill status.
- **Radius:** 14–20px; **mobile-first**; hit-target ≥ 44px.
- Lihat `mockup-reference/` untuk acuan tata letak hero, upload card, dan dashboard.

---

## 7. Acceptance Criteria (contoh)
- **F-01:** Drag `.xlsx` valid memicu parsing; file > 10 MB atau `.pdf` ditolak dgn pesan jelas.
- **F-02:** Kolom "Tanggal", "Total" (angka), "Kategori" (teks) terdeteksi tipe-nya dengan benar.
- **F-03:** KPI Total = Σ kolom numerik utama; cocok dengan hitung manual.
- **F-04:** Minimal 2 grafik muncul otomatis tanpa konfigurasi user.
- **F-05:** Klik header kolom mengurutkan tabel; search menyaring baris real-time.
- **NFR:** Tidak ada request jaringan untuk isi file (cek Network tab) — bukti proses lokal.
