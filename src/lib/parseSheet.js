// Parsing file Excel/CSV pakai SheetJS — 100% di browser.
import * as XLSX from 'xlsx';
import { detectColumns, coerceRows } from './detectColumns';

export const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT_EXT = ['xlsx', 'xls', 'csv'];

export function validateFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPT_EXT.includes(ext)) {
    return `Format .${ext || '?'} tidak didukung. Gunakan .xlsx, .xls, atau .csv.`;
  }
  if (file.size > MAX_BYTES) {
    return 'Ukuran file melebihi 10 MB. Coba file yang lebih kecil.';
  }
  if (file.size === 0) {
    return 'File kosong.';
  }
  return null;
}

/** Daftar nama sheet dalam workbook. */
function listSheets(wb) {
  return wb.SheetNames.filter((n) => {
    const ws = wb.Sheets[n];
    return ws && ws['!ref'];
  });
}

/**
 * Bangun struktur data untuk satu sheet.
 * @returns {{ headers, columns, rows, rawRows, rowCount }}
 */
function buildSheet(wb, sheetName) {
  const ws = wb.Sheets[sheetName];
  // header:1 -> array of arrays; cellDates agar tanggal jadi Date asli
  const aoa = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    raw: true,
    defval: null,
    blankrows: false,
  });

  if (!aoa.length) {
    return { headers: [], columns: [], rows: [], rawRows: [], rowCount: 0 };
  }

  const headers = (aoa[0] || []).map((h, i) =>
    h == null || h === '' ? `Kolom ${i + 1}` : String(h).trim()
  );
  const rawRows = aoa.slice(1).filter((r) => r.some((c) => c !== null && c !== ''));
  const columns = detectColumns(headers, rawRows);
  const rows = coerceRows(rawRows, columns);

  return { headers, columns, rows, rawRows, rowCount: rows.length };
}

/**
 * Parse ArrayBuffer -> workbook info + sheet pertama.
 * @returns {{ sheets: string[], activeSheet, ...buildSheet }}
 */
export function parseWorkbook(arrayBuffer, preferredSheet) {
  const wb = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
  const sheets = listSheets(wb);
  if (!sheets.length) {
    throw new Error('Tidak ada sheet berisi data dalam file ini.');
  }
  const activeSheet =
    preferredSheet && sheets.includes(preferredSheet) ? preferredSheet : sheets[0];
  const built = buildSheet(wb, activeSheet);
  // simpan workbook supaya ganti sheet tak perlu baca ulang file
  return { wb, sheets, activeSheet, ...built };
}

/** Ganti sheet aktif dari workbook yang sudah diparse. */
export function readSheet(wb, sheetName) {
  return { activeSheet: sheetName, ...buildSheet(wb, sheetName) };
}

/** Baca File -> ArrayBuffer (Promise). */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Gagal membaca file.'));
    reader.readAsArrayBuffer(file);
  });
}
