'use client';

import { useState, useCallback } from 'react';

/**
 * Ekspor elemen DOM jadi PDF — html2canvas + jspdf dimuat dinamis
 * supaya tidak membebani bundle awal.
 */
export function useExportPdf() {
  const [exporting, setExporting] = useState(false);

  const exportPdf = useCallback(async (node, fileName = 'sheetsight') => {
    if (!node) return;
    setExporting(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const bg = getComputedStyle(document.body).backgroundColor;
      const canvas = await html2canvas(node, {
        scale: 2,
        backgroundColor: bg,
        useCORS: true,
        logging: false,
      });
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgW = pageW;
      const imgH = (canvas.height * imgW) / canvas.width;

      let remaining = imgH;
      let position = 0;
      // potong jadi beberapa halaman bila terlalu panjang
      while (remaining > 0) {
        pdf.addImage(img, 'PNG', 0, position, imgW, imgH);
        remaining -= pageH;
        if (remaining > 0) {
          pdf.addPage();
          position -= pageH;
        }
      }
      pdf.save(`${fileName.replace(/\.[^.]+$/, '')}-dashboard.pdf`);
    } catch (e) {
      console.error('Gagal ekspor PDF:', e);
      alert('Gagal membuat PDF. Coba lagi.');
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportPdf, exporting };
}
