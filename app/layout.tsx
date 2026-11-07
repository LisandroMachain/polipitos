import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Polipito from '@/components/Polipito';
import './globals.css';

export const metadata: Metadata = {
  title: 'Polipitos',
  description: 'La historia de las colonoscopias, qué son los pólipos, y la timba: ¿cuántos aparecen en la 4ª?',
  openGraph: {
    title: 'Polipitos 🎯 ¿Cuántos aparecen en la 4ª colonoscopia?',
    description: '13 · 7 · 12 · ¿? Hagan sus apuestas.',
  },
};

export const viewport: Viewport = { themeColor: '#fff5ec', viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Gloria+Hallelujah&family=Nunito:wght@400;700&display=swap"
        />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 12c22 0 38 18 38 42 0 22-14 36-38 36S12 76 12 54c0-24 16-42 38-42z' fill='%23e0577b'/><circle cx='38' cy='51' r='5' fill='%234a2a3a'/><circle cx='62' cy='51' r='5' fill='%234a2a3a'/></svg>" />
      </head>
      <body>
        <header className="contenedor cabecera">
          <Link href="/" className="marca">
            <Polipito size={34} />
            Polipitos
          </Link>
          <Link href="/historia" className="chip">La historia</Link>
        </header>
        {children}
        <Nav />
      </body>
    </html>
  );
}
