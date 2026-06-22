// Saran KPI & grafik otomatis berdasarkan tipe kolom (PRD §4).

/** Statistik dasar satu kolom numerik. */
function stats(rows, key) {
  const vals = rows.map((r) => r[key]).filter((v) => typeof v === 'number');
  if (!vals.length) return null;
  const sum = vals.reduce((a, b) => a + b, 0);
  const avg = sum / vals.length;
  const variance =
    vals.reduce((a, b) => a + (b - avg) ** 2, 0) / vals.length;
  return {
    sum,
    avg,
    min: Math.min(...vals),
    max: Math.max(...vals),
    count: vals.length,
    cv: avg !== 0 ? Math.sqrt(variance) / Math.abs(avg) : 0, // koef. variasi
  };
}

/**
 * Urutkan kolom kategori berdasar "kelayakan untuk dikelompokkan".
 * Hindari kolom ber-kardinalitas terlalu tinggi (mis. ID/nomor unik) atau
 * terlalu rendah (hanya 1 nilai). Ideal: 2–15 nilai berbeda.
 */
export function rankCategories(rows, columns) {
  const total = rows.length || 1;
  return columns
    .filter((c) => c.type === 'category')
    .map((c) => {
      const uniq = new Set(
        rows.map((r) => r[c.name]).filter((v) => v != null && v !== '')
      ).size;
      const ratio = uniq / total; // 1 = setiap baris unik (kemungkinan ID)
      let score;
      if (uniq <= 1) score = -1; // tak berguna
      else if (ratio >= 0.9) score = -1; // mirip ID/unik
      else if (uniq <= 15) score = 100 - uniq; // ideal: sedikit kategori
      else score = 40 - ratio * 30; // banyak nilai, kurang ideal
      return { ...c, uniq, ratio, score };
    })
    .filter((c) => c.score >= 0)
    .sort((a, b) => b.score - a.score);
}

/** Pilih kolom numerik "metrik utama": variasi (CV) tertinggi. */
export function pickPrimaryMetric(rows, columns) {
  const numeric = columns.filter((c) => c.type === 'number');
  if (!numeric.length) return null;
  let best = null;
  for (const col of numeric) {
    const s = stats(rows, col.name);
    if (!s) continue;
    if (!best || s.cv > best.cv) best = { ...col, ...s };
  }
  return best;
}

/** KPI cards otomatis. */
export function buildKpis(rows, columns) {
  const primary = pickPrimaryMetric(rows, columns);
  const cards = [
    { label: 'Jumlah Baris', value: rows.length, kind: 'count' },
  ];
  if (primary) {
    cards.unshift(
      { label: `Total ${primary.name}`, value: primary.sum, kind: 'number' },
      { label: `Rata-rata ${primary.name}`, value: primary.avg, kind: 'number' }
    );
    cards.push(
      { label: `Maks ${primary.name}`, value: primary.max, kind: 'number' }
    );
  }
  return { primary, cards: cards.slice(0, 4) };
}

/** Agregasi numerik per nilai kategori/tanggal -> data chart. */
export function aggregate(rows, groupKey, valueKey, groupType) {
  const map = new Map();
  for (const r of rows) {
    let g = r[groupKey];
    if (g == null || g === '') continue;
    if (groupType === 'date' && g instanceof Date) {
      // kelompokkan per bulan
      g = `${g.getFullYear()}-${String(g.getMonth() + 1).padStart(2, '0')}`;
    }
    const key = String(g);
    const cur = map.get(key) || { name: key, value: 0, count: 0 };
    if (valueKey && typeof r[valueKey] === 'number') cur.value += r[valueKey];
    cur.count += 1;
    map.set(key, cur);
  }
  let arr = [...map.values()];
  if (groupType === 'date') {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  } else {
    arr.sort((a, b) => (valueKey ? b.value - a.value : b.count - a.count));
  }
  return arr;
}

/**
 * Saran konfigurasi grafik. Mengembalikan array konfig:
 *  - trend (line/bar) bila ada tanggal + numerik
 *  - bar per kategori bila ada kategori + numerik
 *  - donut distribusi kategori
 */
export function suggestCharts(rows, columns) {
  const dates = columns.filter((c) => c.type === 'date');
  const categories = rankCategories(rows, columns); // sudah terurut & tanpa ID
  const primary = pickPrimaryMetric(rows, columns);
  const out = [];

  // 1) Tren waktu
  if (dates.length && primary) {
    out.push({
      id: 'trend',
      type: 'line',
      title: `${primary.name} per Waktu`,
      subtitle: `dari kolom "${dates[0].name}" + "${primary.name}"`,
      groupKey: dates[0].name,
      groupType: 'date',
      valueKey: primary.name,
      data: aggregate(rows, dates[0].name, primary.name, 'date'),
    });
  }

  // 2) Bar per kategori (metrik numerik)
  if (categories.length && primary) {
    const cat = categories[0];
    out.push({
      id: 'bar-cat',
      type: 'bar',
      title: `${primary.name} per ${cat.name}`,
      subtitle: `kolom "${cat.name}"`,
      groupKey: cat.name,
      groupType: 'category',
      valueKey: primary.name,
      data: aggregate(rows, cat.name, primary.name, 'category').slice(0, 12),
    });
  }

  // 3) Donut distribusi kategori (count)
  if (categories.length) {
    const cat = categories[categories.length > 1 ? 1 : 0];
    out.push({
      id: 'donut',
      type: 'donut',
      title: `Distribusi ${cat.name}`,
      subtitle: `jumlah baris per "${cat.name}"`,
      groupKey: cat.name,
      groupType: 'category',
      valueKey: null,
      data: aggregate(rows, cat.name, null, 'category').slice(0, 8),
    });
  }

  // Fallback: tak ada kategori & tak ada tanggal, tapi ada >=1 numerik ->
  // distribusi sederhana tidak relevan; biarkan kosong (UI tampilkan tabel).
  return out;
}
