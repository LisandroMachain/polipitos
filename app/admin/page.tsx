'use client';
import { useCallback, useEffect, useState } from 'react';

type Q = { id: number; name: string; body: string; status: string; answer: string | null };
type B = { id: number; name: string; guess: number };
type S = { exam_at: string; bets_close_at: string; result: number | null; result_note: string | null };

const CLAVE = 'polipitos:admin';

export default function Admin() {
  const [pass, setPass] = useState('');
  const [ok, setOk] = useState(false);
  const [data, setData] = useState<{ settings: S; questions: Q[]; bets: B[] } | null>(null);
  const [res, setRes] = useState('');
  const [nota, setNota] = useState('');
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState('');

  const cargar = useCallback(async (p: string) => {
    const r = await fetch('/api/admin', { headers: { 'x-admin-password': p } });
    if (!r.ok) { setOk(false); setMsg('Clave incorrecta.'); return; }
    const d = await r.json();
    setData(d); setOk(true); setMsg('');
    setRes(d.settings?.result ?? ''); setNota(d.settings?.result_note ?? '');
    try { sessionStorage.setItem(CLAVE, p); } catch {}
  }, []);

  useEffect(() => {
    try {
      const p = sessionStorage.getItem(CLAVE);
      if (p) { setPass(p); cargar(p); }
    } catch {}
  }, [cargar]);

  async function accion(body: object) {
    const r = await fetch('/api/admin', {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-admin-password': pass }, body: JSON.stringify(body),
    });
    const d = await r.json();
    setMsg(d.ok ? 'Guardado.' : `Error: ${d.error}`);
    cargar(pass);
  }

  if (!ok) {
    return (
      <main className="contenedor">
        <form className="tarjeta" onSubmit={(e) => { e.preventDefault(); cargar(pass); }}>
          <h1 style={{ fontSize: 36 }}>Panel</h1>
          <label htmlFor="pass">Clave<input id="pass" type="password" className="campo" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
          <button className="boton rosa">Entrar</button>
          {msg && <p className="aviso">{msg}</p>}
        </form>
      </main>
    );
  }

  const pendientes = data?.questions.filter((q) => q.status === 'pendiente') ?? [];
  const aprobadas = data?.questions.filter((q) => q.status === 'aprobada' || q.status === 'respondida') ?? [];

  return (
    <main className="contenedor">
      <h1 style={{ fontSize: 40 }}>Panel</h1>
      {msg && <p className="aviso">{msg}</p>}

      <section className="tarjeta">
        <h2>Resultado de la 4ª</h2>
        <p className="suave chico">Al cargarlo se cierran las apuestas, aparece el ranking y se desbloquea el nivel 4 del juego.</p>
        <label htmlFor="res">Pólipos encontrados<input id="res" type="number" min={0} max={99} className="campo" value={res} onChange={(e) => setRes(e.target.value)} /></label>
        <label htmlFor="nota">Comentario (opcional)<input id="nota" className="campo" value={nota} onChange={(e) => setNota(e.target.value)} /></label>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="boton rosa" onClick={() => accion({ action: 'settings', result: res, result_note: nota })}>Publicar resultado</button>
          <button className="boton borde" onClick={() => accion({ action: 'settings', result: null, result_note: null })}>Borrar resultado</button>
        </div>
        <p className="chico suave">Cierre de apuestas: {data && new Date(data.settings.bets_close_at).toLocaleString('es-AR')}</p>
      </section>

      <section className="pila">
        <h2>Preguntas para aprobar ({pendientes.length})</h2>
        {pendientes.map((q) => (
          <div key={q.id} className="tarjeta">
            <p><strong>{q.body}</strong></p>
            <span className="chico suave">De {q.name}</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="boton" onClick={() => accion({ action: 'question', id: q.id, status: 'aprobada' })}>Aprobar</button>
              <button className="boton borde" onClick={() => accion({ action: 'question', id: q.id, status: 'rechazada' })}>Rechazar</button>
            </div>
          </div>
        ))}
      </section>

      <section className="pila">
        <h2>Cargar respuestas</h2>
        {aprobadas.map((q) => (
          <div key={q.id} className="tarjeta">
            <p><strong>{q.body}</strong></p>
            <label htmlFor={`r-${q.id}`}>Lo que respondió
              <textarea id={`r-${q.id}`} className="campo" rows={2} value={respuestas[q.id] ?? q.answer ?? ''}
                onChange={(e) => setRespuestas({ ...respuestas, [q.id]: e.target.value })} />
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="boton" onClick={() => accion({ action: 'question', id: q.id, status: 'respondida', answer: respuestas[q.id] ?? q.answer })}>Guardar respuesta</button>
              <button className="boton borde" onClick={() => accion({ action: 'question', id: q.id, status: 'rechazada' })}>Ocultar</button>
            </div>
          </div>
        ))}
      </section>

      <section className="pila">
        <h2>Apuestas ({data?.bets.length ?? 0})</h2>
        {data?.bets.map((b) => (
          <div key={b.id} className="tarjeta" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{b.name} · <strong className="num">{b.guess}</strong></span>
            <button className="boton borde" onClick={() => accion({ action: 'delete_bet', id: b.id })}>Borrar</button>
          </div>
        ))}
      </section>
    </main>
  );
}
