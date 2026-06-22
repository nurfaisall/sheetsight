import './globals.css';
import { Source_Sans_3, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { DataProvider } from '@/context/DataContext';

const sans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'SheetSight — Excel jadi Dashboard, otomatis',
  description:
    'Upload file Excel/CSV → dashboard interaktif otomatis (KPI, grafik, tabel). Semua diproses di browser, tanpa server.',
};

export const viewport = {
  themeColor: '#0A0E1A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" data-theme="dark" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <ThemeProvider>
          <DataProvider>{children}</DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
