'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ITEMS = [
  { href: '/', label: 'Inicio', d: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z' },
  { href: '/apuestas', label: 'Timba', d: 'M5 5h14v4a2 2 0 000 4v4H5v-4a2 2 0 000-4zM12 7v2M12 11v2M12 15v1' },
  { href: '/preguntas', label: 'Preguntas', d: 'M4 5h16v11H9l-5 4zM10 9a2 2 0 114 0c0 1.5-2 1.5-2 3M12 14v.01' },
  { href: '/juego', label: 'Jugar', d: 'M6 8h12a4 4 0 014 4v1a3 3 0 01-5 2l-1-1H8l-1 1a3 3 0 01-5-2v-1a4 4 0 014-4zM8 10v4M6 12h4M16 11v.01M18 13v.01' },
  { href: '/aprende', label: 'Aprendé', d: 'M4 6l8-3 8 3-8 3zM7 8v5c0 2 10 2 10 0V8M20 6v6' },
];

export default function Nav() {
  const path = usePathname();
  return (
    <nav className="nav" aria-label="Secciones">
      <ul>
        {ITEMS.map((it) => (
          <li key={it.href}>
            <Link href={it.href} aria-current={path === it.href ? 'page' : undefined}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d={it.d} />
              </svg>
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
