'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DATOS_101 } from '@/lib/datos';

const W = 360;
const H = 600;
const R = 25; // radio del colon
const PUNTA = 7; // radio de la punta del endoscopio
const RADIO_POLIPO = 8;
const AGARRE = 46; // distancia para agarrar la punta con el dedo
const MANTENER_MS = 450; // tiempo sobre el pólipo para sacarlo

// Recorrido: recto → sigmoide → descendente → transverso → ascendente → ciego
const GUIA: [number, number][] = [
  [0.5, 1.05], [0.5, 0.92], [0.34, 0.84], [0.5, 0.76], [0.76, 0.7], [0.83, 0.54], [0.77, 0.38],
  [0.83, 0.2], [0.68, 0.08], [0.5, 0.17], [0.32, 0.08], [0.17, 0.18], [0.23, 0.36], [0.15, 0.52],
  [0.22, 0.66], [0.2, 0.76],
];

type P = { x: number; y: number };
type Polipo = P & { fuera: boolean; t: number; caida: number };

function catmull(pts: P[], pasos = 18): P[] {
  const out: P[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let s = 0; s < pasos; s++) {
      const t = s / pasos, t2 = t * t, t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
}

const CAMINO = catmull(GUIA.map(([x, y]) => ({ x: x * W, y: y * H })));
const LARGOS = CAMINO.reduce<number[]>((acc, p, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p.x - CAMINO[i - 1].x, p.y - CAMINO[i - 1].y));
  return acc;
}, []);
const TOTAL = LARGOS[LARGOS.length - 1];

function distSeg(p: P, a: P, b: P) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const l = dx * dx + dy * dy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / l));
  return { d: Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy)), t };
}

/** Distancia al centro del colon y el índice del tramo más cercano. */
function cercano(p: P) {
  let mejor = Infinity, idx = 0;
  for (let i = 0; i < CAMINO.length - 1; i++) {
    const { d } = distSeg(p, CAMINO[i], CAMINO[i + 1]);
    if (d < mejor) { mejor = d; idx = i; }
  }
  return { d: mejor, idx };
}

function puntoEn(largo: number) {
  let i = LARGOS.findIndex((l) => l >= largo);
  if (i <= 0) i = 1;
  const a = CAMINO[i - 1], b = CAMINO[i];
  const t = (largo - LARGOS[i - 1]) / (LARGOS[i] - LARGOS[i - 1] || 1);
  const dx = b.x - a.x, dy = b.y - a.y, l = Math.hypot(dx, dy) || 1;
  return { x: a.x + dx * t, y: a.y + dy * t, nx: -dy / l, ny: dx / l };
}

function crearPolipos(n: number): Polipo[] {
  const lista: Polipo[] = [];
  for (let i = 0; i < n; i++) {
    const largo = TOTAL * (0.12 + (0.86 * (i + 0.5)) / n);
    const p = puntoEn(largo);
    const lado = i % 2 === 0 ? 1 : -1;
    const off = (R - RADIO_POLIPO - 1) * lado;
    lista.push({ x: p.x + p.nx * off, y: p.y + p.ny * off, fuera: false, t: 0, caida: 0 });
  }
  return lista;
}

const INICIO: P = { x: CAMINO[20].x, y: CAMINO[20].y };

let audio: AudioContext | null = null;
function sonido(tipo: 'zumbido' | 'pop') {
  try {
    audio ??= new AudioContext();
    const o = audio.createOscillator(), g = audio.createGain();
    o.connect(g); g.connect(audio.destination);
    const t = audio.currentTime;
    if (tipo === 'zumbido') {
      o.type = 'sawtooth'; o.frequency.value = 110;
      g.gain.setValueAtTime(0.15, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.start(t); o.stop(t + 0.45);
    } else {
      o.type = 'sine'; o.frequency.setValueAtTime(500, t); o.frequency.exponentialRampToValueAtTime(1100, t + 0.12);
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.start(t); o.stop(t + 0.15);
    }
  } catch {}
}

function dibujarPolipo(ctx: CanvasRenderingContext2D, p: Polipo) {
  const escala = p.fuera ? Math.max(0, 1 - p.caida) : 1;
  if (escala <= 0) return;
  ctx.save();
  ctx.translate(p.x, p.y - (p.fuera ? p.caida * 30 : 0));
  ctx.scale(escala, escala);
  ctx.fillStyle = '#e0577b';
  ctx.beginPath(); ctx.ellipse(0, 0, RADIO_POLIPO + 1, RADIO_POLIPO, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.beginPath(); ctx.ellipse(-3, -4, 3, 2, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a2a3a';
  ctx.beginPath(); ctx.arc(-3, -1, 1.4, 0, Math.PI * 2); ctx.arc(3, -1, 1.4, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#4a2a3a'; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
  ctx.beginPath();
  if (p.t > 0) ctx.arc(0, 3.5, 1.8, 0, Math.PI * 2);
  else { ctx.moveTo(-2.5, 2.5); ctx.quadraticCurveTo(0, 4.8, 2.5, 2.5); }
  ctx.stroke();
  if (p.t > 0 && !p.fuera) {
    ctx.strokeStyle = '#ffe066'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, RADIO_POLIPO + 5, -Math.PI / 2, -Math.PI / 2 + (p.t / MANTENER_MS) * Math.PI * 2); ctx.stroke();
  }
  ctx.restore();
}

type Estado = 'jugando' | 'perdiste' | 'ganaste';

export default function Juego({ niveles, onSalir }: { niveles: number[]; onSalir?: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [nivel, setNivel] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [sacados, setSacados] = useState(0);
  const [estado, setEstado] = useState<Estado>('jugando');
  const juego = useRef({
    punta: { ...INICIO },
    agarrada: false,
    polipos: crearPolipos(niveles[0]),
    golpe: 0,
    vidas: 3,
    activo: true,
    inicio: performance.now(),
  });
  const [tiempo, setTiempo] = useState(0);

  const empezar = useCallback((n: number) => {
    juego.current = {
      punta: { ...INICIO }, agarrada: false, polipos: crearPolipos(niveles[n]), golpe: 0, vidas: 3, activo: true, inicio: performance.now(),
    };
    setNivel(n); setVidas(3); setSacados(0); setEstado('jugando');
  }, [niveles]);

  // Dibujo
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const tubo = new Path2D();
    CAMINO.forEach((p, i) => (i ? tubo.lineTo(p.x, p.y) : tubo.moveTo(p.x, p.y)));
    let raf = 0, antes = performance.now();

    const cuadro = (ahora: number) => {
      const dt = Math.min(50, ahora - antes); antes = ahora;
      const g = juego.current;
      ctx.fillStyle = '#ffe1d6'; ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.strokeStyle = g.golpe > 0 ? '#c0304f' : '#d98a8a'; ctx.lineWidth = R * 2 + 8; ctx.stroke(tubo);
      ctx.strokeStyle = '#f7b9a8'; ctx.lineWidth = R * 2; ctx.stroke(tubo);
      ctx.strokeStyle = '#fbd0c3'; ctx.lineWidth = R * 0.9; ctx.stroke(tubo);
      // pliegues (haustras)
      ctx.strokeStyle = 'rgba(200,110,110,.28)'; ctx.lineWidth = 2;
      for (let l = 30; l < TOTAL; l += 24) {
        const p = puntoEn(l);
        ctx.beginPath();
        ctx.moveTo(p.x + p.nx * (R - 2), p.y + p.ny * (R - 2));
        ctx.quadraticCurveTo(p.x + p.nx * 0 + (p.ny * 5), p.y - p.nx * 5, p.x - p.nx * (R - 2), p.y - p.ny * (R - 2));
        ctx.stroke();
      }
      // pólipos
      g.polipos.forEach((p) => {
        if (p.fuera && p.caida < 1) p.caida += dt / 300;
        dibujarPolipo(ctx, p);
      });
      // cable del endoscopio
      const { idx } = cercano(g.punta);
      ctx.strokeStyle = '#3b3b45'; ctx.lineWidth = 6;
      ctx.beginPath(); ctx.moveTo(CAMINO[0].x, CAMINO[0].y);
      for (let i = 1; i <= idx; i++) ctx.lineTo(CAMINO[i].x, CAMINO[i].y);
      ctx.lineTo(g.punta.x, g.punta.y); ctx.stroke();
      // punta con luz
      const luz = ctx.createRadialGradient(g.punta.x, g.punta.y, 0, g.punta.x, g.punta.y, 34);
      luz.addColorStop(0, 'rgba(255,240,170,.55)'); luz.addColorStop(1, 'rgba(255,240,170,0)');
      ctx.fillStyle = luz; ctx.beginPath(); ctx.arc(g.punta.x, g.punta.y, 34, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = g.agarrada ? '#ffe066' : '#f5c400';
      ctx.strokeStyle = '#3b3b45'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(g.punta.x, g.punta.y, PUNTA, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      if (!g.agarrada && g.activo) {
        ctx.strokeStyle = 'rgba(74,42,58,.5)'; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(g.punta.x, g.punta.y, 16 + Math.sin(ahora / 250) * 3, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
      }
      if (g.golpe > 0) {
        g.golpe -= dt;
        ctx.fillStyle = `rgba(224,87,123,${Math.max(0, g.golpe / 400) * 0.35})`; ctx.fillRect(0, 0, W, H);
      }
      // sacar pólipos manteniendo la punta encima
      if (g.activo && g.agarrada) {
        g.polipos.forEach((p) => {
          if (p.fuera) return;
          if (Math.hypot(p.x - g.punta.x, p.y - g.punta.y) < RADIO_POLIPO + PUNTA + 2) {
            p.t += dt;
            if (p.t >= MANTENER_MS) {
              p.fuera = true; sonido('pop');
              const n = g.polipos.filter((q) => q.fuera).length;
              setSacados(n);
              if (n === g.polipos.length) {
                g.activo = false; g.agarrada = false;
                setTiempo(Math.round((performance.now() - g.inicio) / 1000));
                setEstado('ganaste');
              }
            }
          } else p.t = 0;
        });
      }
      raf = requestAnimationFrame(cuadro);
    };
    raf = requestAnimationFrame(cuadro);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Control con el dedo o el mouse
  useEffect(() => {
    const c = canvas.current!;
    const pos = (e: PointerEvent): P => {
      const r = c.getBoundingClientRect();
      return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
    };
    const abajo = (e: PointerEvent) => {
      const g = juego.current;
      if (!g.activo) return;
      const p = pos(e);
      if (Math.hypot(p.x - g.punta.x, p.y - g.punta.y) < AGARRE) {
        g.agarrada = true;
        c.setPointerCapture(e.pointerId);
      }
    };
    const mover = (e: PointerEvent) => {
      const g = juego.current;
      if (!g.agarrada || !g.activo) return;
      const destino = pos(e);
      const dx = destino.x - g.punta.x, dy = destino.y - g.punta.y;
      const pasos = Math.ceil(Math.hypot(dx, dy) / 2);
      for (let i = 1; i <= pasos; i++) {
        const q = { x: g.punta.x + (dx * 1) / pasos, y: g.punta.y + (dy * 1) / pasos };
        if (cercano(q).d > R - PUNTA) {
          // ¡Tocó la pared!
          g.agarrada = false; g.golpe = 400; g.vidas -= 1;
          sonido('zumbido');
          try { navigator.vibrate?.(200); } catch {}
          setVidas(g.vidas);
          if (g.vidas <= 0) { g.activo = false; setEstado('perdiste'); }
          return;
        }
        g.punta = q;
      }
    };
    const arriba = () => { juego.current.agarrada = false; };
    c.addEventListener('pointerdown', abajo);
    c.addEventListener('pointermove', mover);
    c.addEventListener('pointerup', arriba);
    c.addEventListener('pointercancel', arriba);
    return () => {
      c.removeEventListener('pointerdown', abajo);
      c.removeEventListener('pointermove', mover);
      c.removeEventListener('pointerup', arriba);
      c.removeEventListener('pointercancel', arriba);
    };
  }, []);

  const total = niveles[nivel];
  const hayOtro = nivel + 1 < niveles.length;

  return (
    <div className="juego">
      <div className="hud">
        <span className="chip">Nivel {nivel + 1} · {nivel + 1}ª colono</span>
        <span className="num">Sacados {sacados}/{total}</span>
        <span aria-label={`${vidas} vidas`}>{'♥'.repeat(Math.max(0, vidas))}<span className="vacia">{'♥'.repeat(3 - Math.max(0, vidas))}</span></span>
      </div>
      <div className="lienzo">
        <canvas ref={canvas} aria-label="Juego: mové la punta amarilla del endoscopio por el colon sin tocar las paredes, y mantenela sobre cada pólipo para sacarlo" />
        {estado !== 'jugando' && (
          <div className="cartel">
            {estado === 'ganaste' ? (
              <>
                <h2>¡Quedó en cero!</h2>
                <p className="num">Sacaste los {total} en {tiempo} segundos.</p>
                <p className="mano">{DATOS_101[nivel % DATOS_101.length]}</p>
                {hayOtro ? (
                  <button className="boton rosa" onClick={() => empezar(nivel + 1)}>Siguiente colonoscopia</button>
                ) : (
                  <button className="boton rosa" onClick={() => empezar(0)}>Jugar de nuevo</button>
                )}
              </>
            ) : (
              <>
                <h2>¡Bzzzt!</h2>
                <p>Tocaste demasiado las paredes. El paciente pide otro médico.</p>
                <button className="boton rosa" onClick={() => empezar(nivel)}>Reintentar</button>
              </>
            )}
            {onSalir && <button className="boton borde" onClick={onSalir}>Salir</button>}
          </div>
        )}
      </div>
      <style>{`
        .juego{display:flex;flex-direction:column;gap:10px;width:100%;max-width:min(420px, calc((100dvh - 210px) * ${W / H}));margin:0 auto}
        .hud{display:flex;justify-content:space-between;align-items:center;gap:8px;font:600 15px/1 var(--titulo);flex-wrap:wrap}
        .hud .vacia{opacity:.25}
        .hud > span:last-child{color:var(--rosa);font-size:20px;letter-spacing:2px}
        .lienzo{position:relative;border-radius:24px;overflow:hidden;box-shadow:0 0 0 3px var(--linea)}
        .lienzo canvas{display:block;width:100%;height:auto;aspect-ratio:${W}/${H};touch-action:none;cursor:grab}
        .cartel{position:absolute;inset:0;background:rgba(255,245,236,.94);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center}
      `}</style>
    </div>
  );
}
