'use client';
import { useEffect, useMemo, useState } from 'react';
import Polipito from '@/components/Polipito';
import SinConfig from '@/components/SinConfig';
import { sb, supabaseConfigured, useName, useSettings, useUid } from '@/lib/supabase';

type Bet = { id: number; user_id: string; name: string; guess: number; created_at: string };

const MAX = 40;

export default function Apuestas() {
  const uid = useUid();
  const settings = useSettings();
  const [name, setName] = useName();
  const [bets, setBets] = useState<Bet[]>([]);
  const [guess, setGuess] = useState(12);
  const [estado, setEstado] = useState<'' | 'guardando' | 'listo' | string>('');

  useEffect(() => {
    if (!supabaseConfigured()) return;
    const cargar = () =>
      sb()
        .from('bets')
        .select('id,user_id,name,guess,created_at')
        .order('created_at')
        .then(({ data }) => data && setBets(data as Bet[]));
    cargar();
    const ch = sb()
      .channel('bets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bets' }, cargar)
      .subscribe();
    return () => {
      sb().removeChannel(ch);
    };
  }, []);

  const mia = bets.find((b) => b.user_id === uid);
  useEffect(() => {
    if (mia) setGuess(mia.guess);
  }, [mia?.guess]); // eslint-disable-line react-hooks/exhaustive-deps

  const resultado = settings?.result ?? null;
  const abiertas =
    settings !== null && resultado === null && Date.now() < new Date(settings.bets_close_at).getTime();

  const conteo = useMemo(() => {
    const c = new Array(MAX + 1).fill(0);
    bets.forEach((b) => (c[Math.min(b.guess, MAX)] += 1));
    return c as number[];
  }, [bets]);
  const tope = Math.max(1, ...conteo);

  const ranking = useMemo(() => {
    const lista = [...bets];
    if (resultado !== null) {
      lista.sort((a, b) => Math.abs(a.guess - resultado) - Math.abs(b.guess - resultado) || a.created_at.localeCompare(b.created_at));
    } else {
      lista.sort((a, b) => a.guess - b.guess);
    }
    return lista;
  }, [bets, resultado]);

  async function apostar(e: React.FormEvent) {
    e.preventDefault();
    if (!uid || !name.trim()) return;
    setEstado('guardando');
    const fila = { user_id: uid, name: name.trim(), guess, updated_at: new Date().toISOString() };
    const { error } = mia
      ? await sb().from('bets').update(fila).eq('user_id', uid)
      : await sb().from('bets').insert(fila);
    setEstado(error ? 'No se pudo guardar. Probá de nuevo en un rato.' : 'listo');
  }

  if (!supabaseConfigured()) return <SinConfig />;

  return (
    <main className="contenedor">
      <section className="pila">
        <span className="chip">La timba</span>
        <h1>¿Cuántos aparecen?</h1>
        <p className="mano">
          Una apuesta por persona. Gana quien quede más cerca del número real. No se juega plata: se juega el honor
          {abiertas ? ' (y la podés cambiar hasta que entre al estudio).' : '.'}
        </p>
      </section>

      {resultado !== null && (
        <section className="tarjeta resultado">
          <Polipito size={72} humor="sorprendido" />
          <div>
            <span className="chico">Resultado oficial de la 4ª</span>
            <strong className="num">{resultado}</strong>
            {settings?.result_note && <p>{settings.result_note}</p>}
          </div>
        </section>
      )}

      {abiertas && (
        <form className="tarjeta" onSubmit={apostar}>
          <label htmlFor="nombre">
            Tu nombre
            <input id="nombre" className="campo" value={name} maxLength={40} required
              placeholder="Como te conoce la familia" onChange={(e) => setName(e.target.value)} />
          </label>
          <div className="elegir">
            <button type="button" className="mas" aria-label="Uno menos" onClick={() => setGuess((g) => Math.max(0, g - 1))}>−</button>
            <output htmlFor="numero" className="num grande">{guess}</output>
            <button type="button" className="mas" aria-label="Uno más" onClick={() => setGuess((g) => Math.min(MAX, g + 1))}>+</button>
          </div>
          <input id="numero" type="range" min={0} max={MAX} value={guess} onChange={(e) => setGuess(+e.target.value)}
            aria-label="Cantidad de pólipos" />
          <button className="boton rosa" disabled={!uid || !name.trim() || estado === 'guardando'}>
            {mia ? 'Cambiar mi apuesta' : 'Apostar'} {guess} {guess === 1 ? 'pólipo' : 'pólipos'}
          </button>
          {estado === 'listo' && <p className="aviso">Listo, {name.trim()}. Quedaste anotado con {guess}.</p>}
          {estado && estado !== 'listo' && estado !== 'guardando' && <p className="aviso">{estado}</p>}
        </form>
      )}

      {!abiertas && resultado === null && settings && (
        <p className="aviso">Las apuestas ya cerraron. Esperamos el resultado.</p>
      )}

      <section className="pila">
        <h2>Cómo viene la timba</h2>
        <p className="suave">{bets.length} {bets.length === 1 ? 'persona apostó' : 'personas apostaron'}.</p>
        <div className="barras" role="img" aria-label="Cantidad de apuestas por número de pólipos">
          {conteo.map((n, i) => (
            <div key={i} className={`barra${i === resultado ? ' gano' : ''}${i === mia?.guess ? ' mia' : ''}`} title={`${i}: ${n}`}>
              <span style={{ height: `${(n / tope) * 100}%` }} />
              {i % 5 === 0 && <small className="num">{i}</small>}
            </div>
          ))}
        </div>
      </section>

      <section className="pila">
        <h2>{resultado !== null ? 'Ranking' : 'Las apuestas'}</h2>
        <ol className="lista">
          {ranking.map((b, i) => (
            <li key={b.id} className={b.user_id === uid ? 'yo' : ''}>
              {resultado !== null && <span className="pos num">{i + 1}</span>}
              <span className="quien">{b.name}</span>
              <strong className="num">{b.guess}</strong>
              {resultado !== null && (
                <span className="chico suave num">
                  {b.guess === resultado ? '¡exacto!' : `a ${Math.abs(b.guess - resultado)}`}
                </span>
              )}
            </li>
          ))}
        </ol>
        {bets.length === 0 && <p className="suave">Nadie apostó todavía. Estrená la timba.</p>}
      </section>

      <style>{`
        .elegir{display:flex;align-items:center;justify-content:center;gap:18px}
        .grande{font:700 72px/1 var(--titulo);color:var(--rosa);min-width:2ch;text-align:center}
        .mas{width:54px;height:54px;border-radius:50%;border:2px solid var(--linea);background:var(--durazno);font:700 28px/1 var(--titulo);color:var(--ciruela);cursor:pointer}
        input[type=range]{width:100%;accent-color:var(--rosa)}
        .resultado{flex-direction:row;align-items:center;gap:16px}
        .resultado strong{display:block;font:700 64px/1 var(--titulo);color:var(--rosa)}
        .barras{display:grid;grid-template-columns:repeat(${MAX + 1},1fr);gap:2px;height:140px;align-items:end;background:var(--blanco);border-radius:18px;padding:14px 12px 24px}
        .barra{height:100%;display:flex;flex-direction:column;justify-content:flex-end;position:relative}
        .barra span{display:block;background:var(--mucosa);border-radius:3px 3px 0 0;min-height:2px}
        .barra.mia span{background:var(--menta)}
        .barra.gano span{background:var(--rosa)}
        .barra small{position:absolute;bottom:-20px;left:50%;transform:translateX(-50%);font-size:11px;color:var(--ciruela-suave)}
        .lista{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}
        .lista li{background:var(--blanco);border-radius:14px;padding:10px 14px;display:flex;align-items:center;gap:12px}
        .lista li.yo{box-shadow:inset 0 0 0 2px var(--menta)}
        .lista .quien{flex:1;min-width:0;overflow-wrap:anywhere}
        .lista strong{font:700 22px/1 var(--titulo);color:var(--rosa)}
        .pos{font:700 15px/1 var(--titulo);color:var(--ciruela-suave);width:2ch}
      `}</style>
    </main>
  );
}
