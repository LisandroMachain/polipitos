import Link from 'next/link';
import Polipito from '@/components/Polipito';
import { CAPITULOS } from '@/lib/datos';

export const metadata = { title: 'La historia · Polipitos' };

export default function Historia() {
  return (
    <main className="contenedor">
      <section className="pila">
        <span className="chip">La historia</span>
        <h1>Cuatro colonoscopias</h1>
        <p className="mano">
          Esta es la historia de una persona muy valiente y de una familia de pólipos que no entiende que no los
          queremos ahí.
        </p>
      </section>

      <ol className="capitulos">
        {CAPITULOS.map((c) => (
          <li key={c.n} className="tarjeta">
            <div className="cab">
              <Polipito size={52} humor={c.encontrados === null ? 'pícaro' : c.quedaron === 0 ? 'dormido' : 'sorprendido'} />
              <div>
                <span className="chico suave">{c.n}ª colonoscopia · {c.fecha}</span>
                <h2>{c.titulo}</h2>
              </div>
            </div>
            {c.encontrados !== null && (
              <dl className="datos">
                <div><dt>Encontrados</dt><dd className="num">{c.encontrados}</dd></div>
                <div><dt>Sacados</dt><dd className="num">{c.sacados}</dd></div>
                <div><dt>Quedaron</dt><dd className="num">{c.quedaron}</dd></div>
              </dl>
            )}
            <p>{c.texto}</p>
            {c.foto && <img src={c.foto.src} alt={c.foto.alt} className="foto" loading="lazy" />}
            {c.encontrados === null && (
              <Link href="/apuestas" className="boton rosa" style={{ alignSelf: 'flex-start' }}>Apostar</Link>
            )}
          </li>
        ))}
      </ol>

      <style>{`
        .capitulos{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:22px;position:relative}
        .cab{display:flex;gap:12px;align-items:center}
        .datos{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:0}
        .datos div{background:var(--durazno);border-radius:14px;padding:10px 12px}
        .datos dt{font:600 12px/1.3 var(--titulo);color:var(--ciruela-suave);text-transform:uppercase;letter-spacing:.05em}
        .datos dd{margin:0;font:700 32px/1.1 var(--titulo);color:var(--rosa)}
        .foto{border-radius:16px;max-height:420px;object-fit:cover;width:100%}
      `}</style>
    </main>
  );
}
