'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/* ---------- piezas de dibujo ---------- */

const ROSA = '#e0577b';
const ROSA_OSC = '#b93a5e';
const MUCOSA = '#f7b9a8';
const PARED = '#d98a8a';
const CIRUELA = '#4a2a3a';
const MENTA = '#7cc6b0';

function Cara({ r, humor = 'feliz' }: { r: number; humor?: 'feliz' | 'serio' | 'asustado' }) {
  const o = r * 0.32;
  return (
    <g fill={CIRUELA}>
      <circle cx={-o} cy={-r * 0.1} r={r * 0.11} />
      <circle cx={o} cy={-r * 0.1} r={r * 0.11} />
      {humor === 'feliz' && (
        <path d={`M${-o * 0.8} ${r * 0.22} Q0 ${r * 0.5} ${o * 0.8} ${r * 0.22}`} stroke={CIRUELA} strokeWidth={r * 0.1} fill="none" strokeLinecap="round" />
      )}
      {humor === 'serio' && <path d={`M${-o * 0.7} ${r * 0.32} H${o * 0.7}`} stroke={CIRUELA} strokeWidth={r * 0.1} strokeLinecap="round" />}
      {humor === 'asustado' && <ellipse cx="0" cy={r * 0.33} rx={r * 0.14} ry={r * 0.18} />}
    </g>
  );
}

function Bolita({ x, y, r, color = ROSA, humor, className, style }: {
  x: number; y: number; r: number; color?: string; humor?: 'feliz' | 'serio' | 'asustado'; className?: string; style?: React.CSSProperties;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className} style={style}>
        <ellipse rx={r * 1.05} ry={r} fill={color} />
        <ellipse cx={-r * 0.35} cy={-r * 0.45} rx={r * 0.3} ry={r * 0.18} fill="#fff" opacity=".35" />
        <Cara r={r} humor={humor} />
      </g>
    </g>
  );
}

/** Tramo de colon horizontal visto de costado. */
function Tubo() {
  return (
    <g>
      <rect x="-10" y="40" width="340" height="150" fill={MUCOSA} />
      <path d="M-10 40 Q40 28 80 40 T160 40 T240 40 T330 40" stroke={PARED} strokeWidth="6" fill="none" />
      <path d="M-10 190 Q40 202 80 190 T160 190 T240 190 T330 190" stroke={PARED} strokeWidth="6" fill="none" />
      {[30, 90, 150, 210, 270].map((x) => (
        <path key={x} d={`M${x} 44 Q${x + 12} 115 ${x} 186`} stroke="#e9a092" strokeWidth="2" fill="none" opacity=".6" />
      ))}
    </g>
  );
}

const T = (txt: string, x: number, y: number, extra: React.SVGProps<SVGTextElement> = {}) => (
  <text x={x} y={y} textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight={600} fontSize="13" fill={CIRUELA} {...extra}>
    {txt}
  </text>
);

/* ---------- escenas ---------- */

function EscenaQueEs() {
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Tres tipos de pólipo creciendo en la pared del colon: plano, con tallito y uno chiquito como una lenteja">
      <Tubo />
      {/* plano (sésil) */}
      <g className="a-crece" style={{ animationDelay: '.2s' }}>
        <path d="M45 190 Q70 150 95 190Z" fill={ROSA} />
        <g transform="translate(70 176)"><Cara r={14} /></g>
      </g>
      {/* con tallito (pediculado) */}
      <g className="a-crece" style={{ animationDelay: '.7s' }}>
        <path d="M156 190 L156 150 M164 190 L164 150" stroke={ROSA_OSC} strokeWidth="6" strokeLinecap="round" />
        <Bolita x={160} y={130} r={20} />
      </g>
      {/* lenteja */}
      <g className="a-crece" style={{ animationDelay: '1.2s' }}>
        <Bolita x={250} y={183} r={8} />
      </g>
      <g className="a-aparece" style={{ animationDelay: '1.7s' }}>
        {T('plano', 70, 218)}
        {T('con tallito', 160, 218)}
        {T('como una lenteja', 250, 218)}
        <ellipse cx="282" cy="152" rx="7" ry="4" fill="#c9a36b" />
        <path d="M262 175 Q270 160 276 155" stroke={CIRUELA} strokeWidth="1.5" fill="none" strokeDasharray="3 3" />
      </g>
      <g className="a-aparece" style={{ animationDelay: '2.2s' }}>
        <rect x="88" y="6" width="144" height="26" rx="13" fill="#fff" />
        {T('casi nunca dan síntomas', 160, 24)}
      </g>
    </svg>
  );
}

function EscenaPorQue() {
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Línea de tiempo de diez años: un pólipo crece y cambia; si se saca al principio, nunca llega a ser peligroso">
      <line x1="30" y1="180" x2="295" y2="180" stroke={CIRUELA} strokeWidth="3" strokeLinecap="round" pathLength={1} className="a-dibuja" />
      {[0, 5, 10].map((a, i) => (
        <g key={a} className="a-aparece" style={{ animationDelay: `${0.3 + i * 0.2}s` }}>
          <line x1={40 + i * 120} y1="174" x2={40 + i * 120} y2="186" stroke={CIRUELA} strokeWidth="3" />
          {T(a === 0 ? 'hoy' : `${a} años`, 40 + i * 120, 205)}
        </g>
      ))}
      <Bolita x={40} y={150} r={11} className="a-crece" style={{ animationDelay: '.6s' }} />
      <g className="a-tachado">
        <Bolita x={160} y={140} r={19} color="#c94468" humor="serio" className="a-crece" style={{ animationDelay: '1.2s' }} />
        <Bolita x={280} y={128} r={28} color="#8f2d4c" humor="serio" className="a-crece" style={{ animationDelay: '1.8s' }} />
      </g>
      {/* el asa corta a tiempo */}
      <g className="a-baja" style={{ animationDelay: '2.6s' }}>
        <line x1="88" y1="20" x2="88" y2="96" stroke="#3b3b45" strokeWidth="5" strokeLinecap="round" />
        <circle cx="88" cy="110" r="14" stroke="#f5c400" strokeWidth="3" fill="none" />
        <rect x="102" y="40" width="112" height="44" rx="12" fill={MENTA} />
        {T('si lo sacan acá,', 158, 58, { fill: '#20443b' })}
        {T('nunca llega a eso', 158, 75, { fill: '#20443b' })}
      </g>
    </svg>
  );
}

function EscenaComo() {
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="El endoscopio entra, rodea el pólipo con un asa, lo corta y lo manda a analizar">
      <Tubo />
      <Bolita x={190} y={170} r={18} humor="asustado" className="a-se-va" style={{ animationDelay: '2.4s' }} />
      <path d="M-10 110 H118 Q150 110 162 138" stroke="#3b3b45" strokeWidth="9" strokeLinecap="round" fill="none" pathLength={1} className="a-dibuja" />
      <circle cx="163" cy="141" r="6" fill="#f5c400" className="a-aparece" style={{ animationDelay: '.9s' }} />
      <g transform="translate(190 168)">
        <ellipse rx="26" ry="22" stroke="#f5c400" strokeWidth="3.5" fill="none" className="a-asa" style={{ animationDelay: '1.3s' }} />
      </g>
      {/* frasco de patología */}
      <g className="a-aparece" style={{ animationDelay: '2.4s' }}>
        <rect x="248" y="58" width="56" height="66" rx="10" fill="#e3f4ef" stroke={MENTA} strokeWidth="3" />
        <rect x="244" y="50" width="64" height="12" rx="4" fill={MENTA} />
        {T('patología', 276, 144)}
      </g>
      <Bolita x={276} y={100} r={13} humor="asustado" className="a-llega" style={{ animationDelay: '3s' }} />
      <g className="a-aparece" style={{ animationDelay: '.2s' }}>
        <rect x="10" y="6" width="150" height="26" rx="13" fill="#fff" />
        {T('con sedación: no se siente', 85, 24)}
      </g>
    </svg>
  );
}

function EscenaCuando() {
  const x = (edad: number) => 30 + ((edad - 20) / 60) * 260;
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Regla de edades de 20 a 80: en Argentina el control se recomienda desde los 50, y algunas sociedades proponen 45">
      <rect x="22" y="120" width="276" height="30" rx="15" fill="#fff" />
      <rect x={x(50)} y="120" width={x(80) - x(50) + 8} height="30" rx="15" fill={MENTA} className="a-ensancha" style={{ animationDelay: '.6s' }} />
      {[20, 30, 40, 50, 60, 70, 80].map((e) => (
        <g key={e}>
          <line x1={x(e)} y1="150" x2={x(e)} y2="160" stroke={CIRUELA} strokeWidth="2" />
          {T(String(e), x(e), 178, { fontSize: 12 })}
        </g>
      ))}
      {T('edad', 296, 200, { fontSize: 11, fill: '#7d5a6b', textAnchor: 'end' })}
      <g className="a-baja" style={{ animationDelay: '1.1s' }}>
        <path d={`M${x(50)} 116 l-9 -14 h18z`} fill={ROSA} />
        <rect x={x(50) - 18} y="52" width="124" height="48" rx="12" fill={ROSA} />
        {T('Argentina:', x(50) + 44, 72, { fill: '#fff' })}
        {T('desde los 50', x(50) + 44, 90, { fill: '#fff' })}
      </g>
      <g className="a-aparece" style={{ animationDelay: '1.8s' }}>
        <line x1={x(45)} y1="122" x2={x(45)} y2="212" stroke={CIRUELA} strokeWidth="2" strokeDasharray="3 3" />
        {T('algunos médicos: 45', x(45) - 6, 224, { fontSize: 11, textAnchor: 'end' })}
      </g>
      <Bolita x={x(32)} y={95} r={14} className="a-salta" style={{ animationDelay: '2.3s' }} />
      {T('¿antes?', x(32), 72, { fontSize: 12 })}
    </svg>
  );
}

function EscenaAlertas() {
  const items = [
    { t: 'sangre', icon: <path d="M0 -16 C8 -4 12 2 12 8 A12 12 0 0 1 -12 8 C-12 2 -8 -4 0 -16Z" fill="#c0304f" /> },
    { t: 'cambios', icon: <path d="M-12 -4 H8 l-6 -6 M12 6 H-8 l6 6" stroke={CIRUELA} strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /> },
    { t: 'anemia', icon: <g><rect x="-14" y="-8" width="24" height="16" rx="3" stroke={CIRUELA} strokeWidth="3" fill="none" /><rect x="10" y="-3" width="4" height="6" fill={CIRUELA} /><rect x="-11" y="-5" width="6" height="10" fill="#c0304f" /></g> },
    { t: 'peso / dolor', icon: <g stroke={CIRUELA} strokeWidth="3" fill="none" strokeLinecap="round"><path d="M-12 10 H12 M0 10 V-8 M-12 -8 H12" /><path d="M-12 -8 l-5 10 h10z M12 -8 l-5 10 h10z" /></g> },
  ];
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Cuatro señales para consultar: sangre, cambios en el ritmo intestinal, anemia, pérdida de peso o dolor">
      {items.map((it, i) => {
        const cx = 44 + i * 77;
        return (
          <g key={it.t}>
            <g transform={`translate(${cx} 104)`}>
              <g className="a-pop" style={{ animationDelay: `${0.3 + i * 0.45}s` }}>
                <circle r="30" fill="#fff" stroke={ROSA} strokeWidth="3" />
                {it.icon}
              </g>
            </g>
            <g className="a-aparece" style={{ animationDelay: `${0.5 + i * 0.45}s` }}>{T(it.t, cx, 158)}</g>
          </g>
        );
      })}
      <g className="a-aparece" style={{ animationDelay: '2.4s' }}>
        <rect x="70" y="182" width="180" height="30" rx="15" fill={ROSA} />
        {T('consultá a cualquier edad', 160, 202, { fill: '#fff' })}
      </g>
      <Bolita x={160} y={36} r={16} humor="asustado" className="a-salta" style={{ animationDelay: '.1s' }} />
    </svg>
  );
}

function EscenaMitos() {
  const mitos = ['"Duele"', '"Sin síntomas no hace falta"', '"Es cosa de viejos"'];
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Tres mitos tachados: duele, sin síntomas no hace falta, es cosa de viejos">
      {mitos.map((m, i) => (
        <g key={m} className="a-entra" style={{ animationDelay: `${0.2 + i * 0.6}s` }}>
          <rect x="24" y={20 + i * 66} width="272" height="52" rx="14" fill="#fff" />
          {T(m, 150, 52 + i * 66, { fontSize: 14, fontFamily: '"Gloria Hallelujah", cursive', fontWeight: 400 })}
          <line x1="44" y1={47 + i * 66} x2="256" y2={47 + i * 66} stroke={ROSA} strokeWidth="2.5" opacity=".8" strokeLinecap="round" pathLength={1} className="a-dibuja" style={{ animationDelay: `${0.7 + i * 0.6}s` }} />
          <g transform={`translate(262 ${30 + i * 66}) rotate(12)`} className="a-aparece" style={{ animationDelay: `${0.9 + i * 0.6}s` }}>
            <rect x="-26" y="-10" width="52" height="20" rx="4" fill="none" stroke={ROSA} strokeWidth="2.5" />
            {T('MITO', 0, 5, { fontSize: 12, fill: ROSA })}
          </g>
        </g>
      ))}
    </svg>
  );
}

function EscenaPrepa() {
  const pasos = [
    { t: 'días antes', s: 'sin fibra', icon: <g><ellipse rx="26" ry="9" fill="#fff" stroke={CIRUELA} strokeWidth="2.5" /><path d="M-10 -2 h20" stroke="#c9a36b" strokeWidth="5" strokeLinecap="round" /></g> },
    { t: 'el día anterior', s: 'bien fría, con sorbete', icon: <g><path d="M-14 -22 H14 L10 22 H-10Z" fill="#e3f4ef" stroke={CIRUELA} strokeWidth="2.5" /><rect x="-8" y="-8" width="8" height="8" fill="#fff" stroke={MENTA} /><rect x="2" y="2" width="7" height="7" fill="#fff" stroke={MENTA} /><path d="M6 -22 L14 -36" stroke={ROSA} strokeWidth="3" strokeLinecap="round" /></g> },
    { t: 'el día', s: 'ir acompañado', icon: <g><Bolita x={-12} y={0} r={14} /><Bolita x={14} y={2} r={12} color={MENTA} /></g> },
  ];
  return (
    <svg viewBox="0 0 320 230" role="img" aria-label="Tres pasos de la preparación: dieta sin fibra, la solución bien fría, ir acompañado">
      <line x1="53" y1="100" x2="267" y2="100" stroke={CIRUELA} strokeWidth="3" strokeDasharray="6 6" className="a-aparece" />
      {pasos.map((p, i) => {
        const cx = 53 + i * 107;
        return (
          <g key={p.t}>
            <g transform={`translate(${cx} 100)`}>
              <g className="a-pop" style={{ animationDelay: `${0.4 + i * 0.6}s` }}>
                <circle r="40" fill={i === 2 ? '#fff' : '#ffe1d6'} stroke={ROSA} strokeWidth="3" />
                {p.icon}
              </g>
            </g>
            <g className="a-aparece" style={{ animationDelay: `${0.7 + i * 0.6}s` }}>
              {T(p.t, cx, 166)}
              {T(p.s, cx, 184, { fontSize: 11, fill: '#7d5a6b', fontWeight: 500 })}
            </g>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- slides ---------- */

export type Slide = {
  id: string;
  titulo: string;
  bajada: string;
  escena: () => React.ReactNode;
  mas: string[];
  tono?: 'rosa';
};

export const SLIDES: Slide[] = [
  {
    id: 'que-es',
    titulo: '¿Qué es un pólipo?',
    bajada: 'Un bultito que crece en la pared del colon. Son muy comunes y casi nunca dan síntomas.',
    escena: EscenaQueEs,
    mas: [
      'Es un bultito que crece en la pared interna del colon (el intestino grueso). Pueden ser chiquitos como una lenteja o más grandes, planos o con un "tallito".',
      'Muchísimos adultos tienen alguno sin saberlo, porque casi nunca dan síntomas.',
    ],
  },
  {
    id: 'por-que',
    titulo: '¿Por qué se sacan?',
    bajada: 'La mayoría no es cáncer. Algunos pueden transformarse con los años, y sacarlos antes lo evita.',
    escena: EscenaPorQue,
    mas: [
      'Algunos tipos, sobre todo los adenomas y los pólipos serrados, pueden transformarse con los años. Ese proceso suele llevar alrededor de diez años.',
      'Si se sacan antes, ese pólipo ya no puede convertirse en nada. Por eso la colonoscopia no solo diagnostica: también previene.',
    ],
  },
  {
    id: 'como',
    titulo: '¿Cómo se sacan?',
    bajada: 'En la misma colonoscopia, con un asa que pasa por el endoscopio. Después se analizan.',
    escena: EscenaComo,
    mas: [
      'El asa o la pinza pasan por dentro del endoscopio. No se siente: se hace con sedación.',
      'Lo que se saca va a anatomía patológica, que dice de qué tipo era. Con eso el médico decide cada cuánto repetir el control.',
    ],
  },
  {
    id: 'cuando',
    titulo: '¿Cuándo hacerse una colonoscopia?',
    bajada: 'En Argentina, desde los 50 si no hay factores de riesgo. Antes, si los hay.',
    escena: EscenaCuando,
    mas: [
      'Es la recomendación del Instituto Nacional del Cáncer para personas sin factores de riesgo. Algunas sociedades médicas ya proponen empezar a los 45.',
      'Hay que empezar antes si hay familiares directos con cáncer colorrectal o pólipos, enfermedad inflamatoria intestinal, o si ya te encontraron pólipos (como acá).',
    ],
  },
  {
    id: 'alertas',
    titulo: 'Consultá sin esperar si tenés',
    bajada: 'Sangre en la materia fecal, cambios en el ritmo intestinal, anemia, o dolor y pérdida de peso sin explicación.',
    escena: EscenaAlertas,
    tono: 'rosa',
    mas: [
      'Sangre en la materia fecal o materia fecal muy oscura.',
      'Cambios en el ritmo intestinal que duran más de unas semanas.',
      'Anemia sin una causa clara, dolor abdominal persistente o pérdida de peso sin explicación.',
      'A cualquier edad: no hace falta esperar a "la edad del control".',
    ],
  },
  {
    id: 'mitos',
    titulo: 'Mitos',
    bajada: 'Tres cosas que se dicen y no son así.',
    escena: EscenaMitos,
    mas: [
      '"Duele": se hace con sedación. Lo más pesado es la preparación del día anterior.',
      '"Si no tengo síntomas, no necesito": los pólipos casi nunca dan síntomas. Justamente por eso se buscan.',
      '"Es cosa de viejos": el riesgo aumenta con la edad, pero cada vez se ven más casos en menores de 50.',
    ],
  },
  {
    id: 'prepa',
    titulo: 'Sobrevivir a la preparación',
    bajada: 'Comer sin fibra, tomar la solución bien fría y no ir solo.',
    escena: EscenaPrepa,
    mas: [
      'Dieta sin fibra y sin semillas los días previos, como indique tu médico.',
      'La solución evacuante entra mejor bien fría y tomada con sorbete.',
      'Tené el baño cerca, papel suave y una buena serie para mirar.',
      'Andá acompañado: después de la sedación no se puede manejar.',
    ],
  },
];

export default function Infografias() {
  const [i, setI] = useState(0);
  const [vuelta, setVuelta] = useState(0); // para repetir la animación
  const toque = useRef<number | null>(null);
  const n = SLIDES.length;

  const ir = useCallback((k: number) => {
    setI(Math.max(0, Math.min(n - 1, k)));
    setVuelta((v) => v + 1);
  }, [n]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') ir(i + 1);
      if (e.key === 'ArrowLeft') ir(i - 1);
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [i, ir]);

  const s = SLIDES[i];
  const Escena = s.escena;

  return (
    <section className="info" aria-roledescription="carrusel" aria-label="Polipitos 101">
      <div
        className={`slide${s.tono === 'rosa' ? ' rosa' : ''}`}
        aria-live="polite"
        onPointerDown={(e) => (toque.current = e.clientX)}
        onPointerUp={(e) => {
          if (toque.current === null) return;
          const dx = e.clientX - toque.current;
          toque.current = null;
          if (dx < -50) ir(i + 1);
          if (dx > 50) ir(i - 1);
        }}
      >
        <div className="escena" key={`${i}-${vuelta}`}>
          <Escena />
        </div>
        <div className="pie">
          <span className="chico suave num">{i + 1} de {n}</span>
          <h2>{s.titulo}</h2>
          <p>{s.bajada}</p>
          <details key={`d-${i}`}>
            <summary>Leer más</summary>
            <ul>{s.mas.map((m) => <li key={m}>{m}</li>)}</ul>
          </details>
        </div>
      </div>

      <div className="controles">
        <button type="button" className="flecha" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Anterior">←</button>
        <div className="puntos" role="tablist">
          {SLIDES.map((x, k) => (
            <button key={x.id} type="button" role="tab" aria-selected={k === i} aria-label={x.titulo}
              className={k === i ? 'on' : ''} onClick={() => ir(k)} />
          ))}
        </div>
        <button type="button" className="flecha" onClick={() => (i === n - 1 ? ir(0) : ir(i + 1))}
          aria-label={i === n - 1 ? 'Volver al principio' : 'Siguiente'}>{i === n - 1 ? '↺' : '→'}</button>
      </div>
      <button type="button" className="repetir chico" onClick={() => setVuelta((v) => v + 1)}>Ver la animación de nuevo</button>

      <style>{`
        .info{display:flex;flex-direction:column;gap:14px}
        .slide{background:var(--blanco);border-radius:26px;overflow:hidden;display:grid;grid-template-columns:1.15fr 1fr;align-items:center;touch-action:pan-y;user-select:none}
        @media (max-width:720px){.slide{grid-template-columns:1fr}}
        .escena{background:var(--durazno-2);aspect-ratio:320/230;max-width:100%}
        .escena svg{display:block;width:100%;height:100%}
        .slide.rosa .escena{background:#ffd3dd}
        .pie{padding:20px 22px 24px;display:flex;flex-direction:column;gap:10px;min-width:0}
        .pie h2{font-size:clamp(24px,5vw,32px)}
        .pie details{font-size:15px}
        .pie summary{cursor:pointer;font:600 15px/1.4 var(--titulo);color:var(--rosa-osc)}
        .pie ul{margin:8px 0 0;padding-left:20px;display:flex;flex-direction:column;gap:6px}
        .controles{display:flex;align-items:center;justify-content:space-between;gap:12px}
        .flecha{width:52px;height:52px;border-radius:50%;border:0;background:var(--rosa);color:#fff;font:700 22px/1 var(--titulo);cursor:pointer;box-shadow:0 3px 0 var(--rosa-osc)}
        .flecha:disabled{opacity:.35;cursor:default}
        .puntos{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
        .puntos button{width:12px;height:12px;border-radius:99px;border:0;background:var(--linea);padding:0;cursor:pointer;transition:width .2s}
        .puntos button.on{width:30px;background:var(--rosa)}
        .flecha:focus-visible,.puntos button:focus-visible,.repetir:focus-visible{outline:3px solid var(--ciruela);outline-offset:2px}
        .repetir{align-self:center;background:none;border:0;color:var(--ciruela-suave);text-decoration:underline;cursor:pointer;font-family:var(--texto)}

        /* Animaciones: el estado final es el de reposo, así con movimiento reducido se ve todo */
        .escena g,.escena line,.escena path,.escena rect,.escena ellipse,.escena circle{transform-box:fill-box;transform-origin:center}
        .a-crece{animation:crece .6s cubic-bezier(.3,1.6,.5,1) both;transform-origin:center bottom !important}
        .a-aparece{animation:aparece .5s ease both}
        .a-pop{animation:pop .5s cubic-bezier(.3,1.7,.5,1) both}
        .a-baja{animation:baja .6s cubic-bezier(.3,1.4,.5,1) both}
        .a-entra{animation:entra .5s ease-out both}
        .a-salta{animation:salta 1.6s ease-in-out both infinite}
        .a-dibuja{stroke-dasharray:1;animation:dibuja .9s ease-out both}
        .a-ensancha{animation:ensancha .9s ease-out both;transform-origin:left center !important}
        .a-tachado{animation:tachado .6s 2.9s ease both}
        .a-asa{animation:asa 1s ease-in-out both}
        .a-se-va{animation:seva .4s ease-in both}
        .a-llega{animation:llega .6s cubic-bezier(.3,1.5,.5,1) both}
        @keyframes crece{from{transform:scale(0)}}
        @keyframes aparece{from{opacity:0}}
        @keyframes pop{from{transform:scale(0)}}
        @keyframes baja{from{transform:translateY(-40px);opacity:0}}
        @keyframes entra{from{transform:translateX(-40px);opacity:0}}
        @keyframes salta{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes dibuja{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
        @keyframes ensancha{from{transform:scaleX(0)}}
        @keyframes tachado{to{opacity:.3}}
        @keyframes asa{0%{transform:scale(0);opacity:0}40%{transform:scale(1.2);opacity:1}100%{transform:scale(1)}}
        @keyframes seva{to{transform:translate(86px,-70px) scale(.7);opacity:0}}
        @keyframes llega{from{transform:translateY(-30px) scale(0);opacity:0}}
        .a-se-va{animation-fill-mode:forwards}
        @media (prefers-reduced-motion:reduce){.a-se-va{opacity:0}}
      `}</style>
    </section>
  );
}
