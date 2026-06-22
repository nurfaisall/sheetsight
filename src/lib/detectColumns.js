// Deteksi tipe kolom: numerik / tanggal / kategori (teks).
// Aturan (PRD §4): sampel N baris; >=80% Number() -> numerik;
// else >=80% cocok pola tanggal -> tanggal; else kategori.

const SAMPLE_SIZE = 50;
const THRESHOLD = 0.8;

const DATE_RE =
  /^\d{4}[-/]\d{1,2}[-/]\d{1,2}([ T]\d{1,2}:\d{2}(:\d{2})?)?$/;
const DATE_RE_DMY = /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}$/;

/** Coba ubah nilai mentah jadi number. Tangani "Rp 1.377.000", "1,5", "12%". */
export function parseNumberLike(raw) {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : null;
  if (typeof raw !== 'string') return null;
  let s = raw.trim();
  if (s === '') return null;
  const percent = s.endsWith('%');
  // buang simbol mata uang & spasi
  s = s.replace(/[Rp$€£\s]/gi, '').replace(/%/g, '');
  // format id: titik = ribuan, koma = desimal
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (/^-?\d+,\d+$/.test(s)) {
    s = s.replace(',', '.');
  }
  if (!/^-?\d*\.?\d+$/.test(s)) return null;
  const n = Number(s);
  if (Number.isNaN(n)) return null;
  return percent ? n / 100 : n;
}

/** Coba ubah nilai jadi Date. */
export function parseDateLike(raw) {
  if (raw instanceof Date) return Number.isNaN(raw.getTime()) ? null : raw;
  if (typeof raw === 'number') return null; // angka murni bukan tanggal
  if (typeof raw !== 'string') return null;
  const s = raw.trim();
  if (!DATE_RE.test(s) && !DATE_RE_DMY.test(s)) return null;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return null;
  return new Date(t);
}

function nonEmpty(values) {
  return values.filter((v) => v !== null && v !== undefined && v !== '');
}

/**
 * @param {string[]} headers
 * @param {any[][]} rows  baris data (tanpa header)
 * @returns {{ name, index, type, sample }[]}
 */
export function detectColumns(headers, rows) {
  return headers.map((name, index) => {
    const column = rows.map((r) => r[index]);
    const sample = nonEmpty(column).slice(0, SAMPLE_SIZE);

    if (sample.length === 0) {
      return { name: name || `Kolom ${index + 1}`, index, type: 'category' };
    }

    const numHits = sample.filter((v) => parseNumberLike(v) !== null).length;
    if (numHits / sample.length >= THRESHOLD) {
      return { name: name || `Kolom ${index + 1}`, index, type: 'number' };
    }

    const dateHits = sample.filter((v) => parseDateLike(v) !== null).length;
    if (dateHits / sample.length >= THRESHOLD) {
      return { name: name || `Kolom ${index + 1}`, index, type: 'date' };
    }

    return { name: name || `Kolom ${index + 1}`, index, type: 'category' };
  });
}

/** Konversi seluruh baris jadi array of objects bertipe sesuai deteksi. */
export function coerceRows(rows, columns) {
  return rows.map((row) => {
    const obj = {};
    for (const col of columns) {
      const raw = row[col.index];
      if (col.type === 'number') obj[col.name] = parseNumberLike(raw);
      else if (col.type === 'date') obj[col.name] = parseDateLike(raw);
      else obj[col.name] = raw == null ? '' : String(raw);
    }
    return obj;
  });
}
