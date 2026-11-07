import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function autorizado(req: Request) {
  const esperado = process.env.ADMIN_PASSWORD ?? '';
  const dado = req.headers.get('x-admin-password') ?? '';
  if (!esperado || esperado.length !== dado.length) return false;
  return timingSafeEqual(Buffer.from(esperado), Buffer.from(dado));
}

function admin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });
}

// GET: todo lo que el panel necesita
export async function GET(req: Request) {
  if (!autorizado(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 });
  const db = admin();
  const [settings, questions, bets] = await Promise.all([
    db.from('settings').select('*').eq('id', 1).single(),
    db.from('questions').select('*').order('created_at', { ascending: false }),
    db.from('bets').select('id,name,guess,created_at').order('created_at'),
  ]);
  return NextResponse.json({ settings: settings.data, questions: questions.data, bets: bets.data });
}

// POST: acciones
export async function POST(req: Request) {
  if (!autorizado(req)) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 });
  const db = admin();
  const b = await req.json();

  if (b.action === 'settings') {
    const cambios: Record<string, unknown> = {};
    if ('result' in b) cambios.result = b.result === null || b.result === '' ? null : Number(b.result);
    if ('result_note' in b) cambios.result_note = b.result_note || null;
    if (b.exam_at) cambios.exam_at = b.exam_at;
    if (b.bets_close_at) cambios.bets_close_at = b.bets_close_at;
    const { error } = await db.from('settings').update(cambios).eq('id', 1);
    return NextResponse.json({ ok: !error, error: error?.message });
  }
  if (b.action === 'question') {
    const cambios: Record<string, unknown> = {};
    if (['pendiente', 'aprobada', 'rechazada', 'respondida'].includes(b.status)) cambios.status = b.status;
    if ('answer' in b) cambios.answer = b.answer || null;
    const { error } = await db.from('questions').update(cambios).eq('id', Number(b.id));
    return NextResponse.json({ ok: !error, error: error?.message });
  }
  if (b.action === 'delete_bet') {
    const { error } = await db.from('bets').delete().eq('id', Number(b.id));
    return NextResponse.json({ ok: !error, error: error?.message });
  }
  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 });
}
