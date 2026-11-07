'use client';
import { useEffect, useState } from 'react';

export default function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const ms = now === null ? null : Math.max(0, new Date(to).getTime() - now);
  const partes =
    ms === null
      ? ['–', '–', '–', '–']
      : [
          Math.floor(ms / 86400000),
          Math.floor(ms / 3600000) % 24,
          Math.floor(ms / 60000) % 60,
          Math.floor(ms / 1000) % 60,
        ].map(String);

  return (
    <div className="cuenta" role="timer" aria-label="Tiempo que falta para la cuarta colonoscopia">
      {['días', 'horas', 'min', 'seg'].map((u, i) => (
        <div key={u}>
          <span className="num">{partes[i]}</span>
          <small>{u}</small>
        </div>
      ))}
      <style>{`
        .cuenta{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:420px}
        .cuenta div{background:var(--blanco);border-radius:16px;padding:10px 4px;display:flex;flex-direction:column;align-items:center}
        .cuenta span{font:700 30px/1 var(--titulo);color:var(--ciruela)}
        .cuenta small{font:600 12px/1.4 var(--titulo);color:var(--ciruela-suave);text-transform:uppercase;letter-spacing:.06em}
      `}</style>
    </div>
  );
}
