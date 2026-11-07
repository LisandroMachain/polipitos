'use client';
import { useEffect, useMemo, useState } from 'react';
import Polipito from '@/components/Polipito';
import SinConfig from '@/components/SinConfig';
import { sb, supabaseConfigured, useName, useUid } from '@/lib/supabase';

type Q = { id: number; user_id: string; name: string; body: string; status: string; answer: string | null; created_at: string };
type V = { question_id: number; user_id: string };

const ESTADO: Record<string, string> = {
  pendiente: 'Esperando que ella la apruebe',
  rechazada: 'Esta no pasó el filtro',
};

export default function Preguntas() {
  const uid = useUid();
  const [name, setName] = useName();
  const [qs, setQs] = useState<Q[]>([]);
  const [votes, setVotes] = useState<V[]>([]);
  const [body, setBody] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!supabaseConfigured() || !uid) return;
    const cargar = async () => {
      const [q, v] = await Promise.all([
        sb().from('questions').select('id,user_id,name,body,status,answer,created_at'),
        sb().from('votes').select('question_id,user_id'),
      ]);
      if (q.data) setQs(q.data as Q[]);
      if (v.data) setVotes(v.data as V[]);
    };
    cargar();
    const ch = sb()
      .channel('preguntas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'questions' }, cargar)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, cargar)
      .subscribe();
    return () => {
      sb().removeChannel(ch);
    };
  }, [uid]);

  const votosPor = useMemo(() => {
    const m = new Map<number, number>();
    votes.forEach((v) => m.set(v.question_id, (m.get(v.question_id) ?? 0) + 1));
    return m;
  }, [votes]);
  const misVotos = new Set(votes.filter((v) => v.user_id === uid).map((v) => v.question_id));

  const publicas = qs
    .filter((q) => q.status === 'aprobada' || q.status === 'respondida')
    .sort((a, b) => (votosPor.get(b.id) ?? 0) - (votosPor.get(a.id) ?? 0) || a.id - b.id);
  const respondidas = publicas.filter((q) => q.status === 'respondida');
  const enVotacion = publicas.filter((q) => q.status === 'aprobada');
  const mias = qs.filter((q) => q.user_id === uid && (q.status === 'pendiente' || q.status === 'rechazada'));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!uid) return;
    const { error } = await sb().from('questions').insert({ user_id: uid, name: name.trim(), body: body.trim() });
    if (error) setMsg('No se pudo mandar. Revisá que tenga entre 3 y 280 letras.');
    else {
      setBody('');
      setMsg('¡Mandada! Aparece acá abajo cuando ella la apruebe.');
    }
  }

  async function votar(id: number) {
    if (!uid) return;
    if (misVotos.has(id)) await sb().from('votes').delete().eq('question_id', id).eq('user_id', uid);
    else await sb().from('votes').insert({ question_id: id, user_id: uid });
  }

  if (!supabaseConfigured()) return <SinConfig />;

  return (
    <main className="contenedor">
      <section className="intro">
        <Polipito size={96} humor="dormido" />
        <div className="pila">
          <span className="chip">Bajo anestesia</span>
          <h1>Preguntas para la salida</h1>
          <p className="mano">
            Cuando se despierta de la anestesia dice cualquier cosa. Proponé qué preguntarle. Ella aprueba cuáles
            entran, y las más votadas se las hacemos el 9 de enero.
          </p>
        </div>
      </section>

      <form className="tarjeta" onSubmit={enviar}>
        <label htmlFor="q-nombre">
          Tu nombre
          <input id="q-nombre" className="campo" value={name} maxLength={40} required onChange={(e) => setName(e.target.value)} />
        </label>
        <label htmlFor="q-texto">
          Tu pregunta
          <textarea id="q-texto" className="campo" rows={3} maxLength={280} required value={body}
            placeholder="¿Cuál es tu pólipo favorito y por qué?" onChange={(e) => setBody(e.target.value)} />
        </label>
        <span className="chico suave num">{body.length}/280</span>
        <button className="boton rosa" disabled={!uid || !name.trim() || body.trim().length < 3}>Mandar pregunta</button>
        {msg && <p className="aviso">{msg}</p>}
      </form>

      {mias.length > 0 && (
        <section className="pila">
          <h3>Tus preguntas en espera</h3>
          <ul className="preguntas">
            {mias.map((q) => (
              <li key={q.id} className="espera">
                <p>{q.body}</p>
                <span className="chico suave">{ESTADO[q.status]}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {respondidas.length > 0 && (
        <section className="pila">
          <h2>Lo que respondió</h2>
          <ul className="preguntas">
            {respondidas.map((q) => (
              <li key={q.id}>
                <p><strong>{q.body}</strong></p>
                <p className="mano respuesta">“{q.answer}”</p>
                <span className="chico suave">Preguntó {q.name}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="pila">
        <h2>En votación</h2>
        {enVotacion.length === 0 && <p className="suave">Todavía no hay preguntas aprobadas.</p>}
        <ul className="preguntas">
          {enVotacion.map((q) => (
            <li key={q.id} className="votable">
              <div className="pila" style={{ gap: 4, minWidth: 0 }}>
                <p>{q.body}</p>
                <span className="chico suave">Propuso {q.name}</span>
              </div>
              <button type="button" className={`voto${misVotos.has(q.id) ? ' on' : ''}`} onClick={() => votar(q.id)}
                aria-pressed={misVotos.has(q.id)} aria-label={`Votar. Tiene ${votosPor.get(q.id) ?? 0} votos`}>
                <span aria-hidden="true">▲</span>
                <span className="num">{votosPor.get(q.id) ?? 0}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <style>{`
        .intro{display:flex;gap:18px;align-items:center}
        @media (max-width:560px){.intro{flex-direction:column;align-items:flex-start}}
        textarea.campo{resize:vertical}
        .preguntas{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
        .preguntas li{background:var(--blanco);border-radius:18px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;overflow-wrap:anywhere}
        .preguntas li.espera{background:transparent;border:2px dashed var(--linea)}
        .preguntas li.votable{flex-direction:row;align-items:center;justify-content:space-between;gap:14px}
        .respuesta{color:var(--rosa-osc);font-size:20px}
        .voto{flex:none;display:flex;flex-direction:column;align-items:center;gap:2px;width:56px;padding:8px 0;border-radius:14px;border:2px solid var(--linea);background:var(--durazno);color:var(--ciruela);font:700 16px/1 var(--titulo);cursor:pointer}
        .voto.on{background:var(--rosa);border-color:var(--rosa);color:var(--blanco)}
      `}</style>
    </main>
  );
}
