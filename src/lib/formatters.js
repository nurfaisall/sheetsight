// Pemformatan angka & teks — locale id-ID.

const nf = new Intl.NumberFormat('id-ID');
const nf2 = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 });

/** Format angka biasa: 1234567 -> "1.234.567". */
export function formatNumber(n) {
  if (n == null || Number.isNaN(n)) return '–';
  return Number.isInteger(n) ? nf.format(n) : nf2.format(n);
}

/** Format ringkas untuk KPI besar: 228200000 -> "228,2 jt". */
export function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return '–';
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${nf2.format(n / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${nf2.format(n / 1_000_000)} jt`;
  if (abs >= 1_000) return `${nf2.format(n / 1_000)} rb`;
  return formatNumber(n);
}

/** Ukuran file: 88064 -> "86 KB". */
export function formatBytes(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const v = bytes / Math.pow(1024, i);
  return `${i === 0 ? v : nf2.format(v)} ${units[i]}`;
}

/** Tampilkan nilai sel apa adanya untuk tabel. */
export function formatCell(value, type) {
  if (value == null || value === '') return '–';
  if (type === 'number' && typeof value === 'number') return formatNumber(value);
  if (type === 'date' && value instanceof Date) {
    return value.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
  return String(value);
}
