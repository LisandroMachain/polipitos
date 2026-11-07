import Link from 'next/link';
import Countdown from '@/components/Countdown';
import Polipito from '@/components/Polipito';
import { CAPITULOS, EXAMEN_4, TOTAL_SACADOS } from '@/lib/datos';

export default function Home() {
  return (
    <main className="contenedor">
      <section className="hero">
        <div className="pila">
          <span className="chip menta">4ª colonoscopia · 9 de enero</span>
          <h1>Polipitos</h1>
          <p className="mano">
            Ya nos sacaron {TOTAL_SACADOS} veces de ahí adentro. Y volvemos siempre. ¿Cuántos seremos esta vez?
          </p>
          <Countdown to={EXAMEN_4} />
          <div className="acciones">
            <Link href="/apuestas" className="boton rosa">Hacer mi apuesta</Link>
            <Link href="/preguntas" className="boton borde">Mandar una pregunta</Link>
          </div>
        </div>
        <div className="familia" aria-hidden="true">
          <Polipito size={150} humor="pícaro" />
          <Polipito size={90} humor="sorprendido" color="#ec7a97" />
          <Polipito size={70} humor="dormido" color="#d4486e" />
        </div>
      </section>

      <section className="pila">
        <h2>El marcador</h2>
        <ol className="marcador">
          {CAPITULOS.map((c) => (
            <li key={c.n} className={c.encontrados === null ? 'proxima' : ''}>
              <span className="chico suave">{c.n}ª colono</span>
              <strong className="num">{c.encontrados ?? '¿?'}</strong>
              <span className="chico">
                {c.encontrados === null
                  ? 'hagan sus apuestas'
                  : c.quedaron === 0
                    ? 'quedó en cero'
                    : `sacaron ${c.sacados}, quedaron ${c.quedaron}`}
              </span>
            </li>
          ))}
        </ol>
        <Link href="/historia">Leer la historia completa →</Link>
      </section>

      <section className="grilla">
        <Link href="/juego" className="tarjeta enlace">
          <Polipito size={56} humor="sorprendido" />
          <h3>Operación Polipito</h3>
          <p className="suave">Manejá el endoscopio y sacalos sin tocar las paredes.</p>
        </Link>
        <Link href="/aprende" className="tarjeta enlace">
          <Polipito size={56} color="#7cc6b0" />
          <h3>Polipitos 101</h3>
          <p className="suave">Qué es un pólipo, por qué se saca y cuándo conviene hacerse el estudio.</p>
        </Link>
      </section>

      <style>{`
        .hero{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:center}
        .acciones{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
        .familia{display:flex;align-items:flex-end;gap:2px}
        .familia svg:nth-child(1){animation:rebote 3s ease-in-out infinite}
        .familia svg:nth-child(2){animation:rebote 3s .4s ease-in-out infinite}
        .familia svg:nth-child(3){animation:rebote 3s .8s ease-in-out infinite}
        @keyframes rebote{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @media (max-width:640px){.hero{grid-template-columns:1fr}.familia{order:-1;justify-content:center}.familia svg:nth-child(1){width:110px;height:110px}}
        .marcador{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .marcador li{background:var(--blanco);border-radius:20px;padding:14px 12px;display:flex;flex-direction:column;gap:2px;min-width:0}
        .marcador strong{font:700 44px/1 var(--titulo);color:var(--rosa)}
        .marcador li.proxima{background:var(--rosa);color:var(--blanco)}
        .marcador li.proxima strong,.marcador li.proxima .suave{color:var(--blanco)}
        @media (max-width:560px){.marcador{grid-template-columns:repeat(2,1fr)}}
        .grilla{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
        @media (max-width:560px){.grilla{grid-template-columns:1fr}}
        .enlace{text-decoration:none;color:inherit;transition:transform .15s}
        .enlace:hover{transform:translateY(-3px)}
      `}</style>
    </main>
  );
}
