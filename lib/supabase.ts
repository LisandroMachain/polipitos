'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

let client: SupabaseClient | null = null;

export function supabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function sb(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }
  return client;
}

/** Sesión anónima: cada celular/navegador es una persona. */
export function useUid() {
  const [uid, setUid] = useState<string | null>(null);
  useEffect(() => {
    if (!supabaseConfigured()) return;
    let alive = true;
    (async () => {
      const { data } = await sb().auth.getSession();
      if (data.session) {
        if (alive) setUid(data.session.user.id);
        return;
      }
      const { data: anon } = await sb().auth.signInAnonymously();
      if (alive && anon.user) setUid(anon.user.id);
    })();
    return () => {
      alive = false;
    };
  }, []);
  return uid;
}

const NAME_KEY = 'polipitos:nombre';

export function useName(): [string, (n: string) => void] {
  const [name, setName] = useState('');
  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? '');
    } catch {}
  }, []);
  return [
    name,
    (n: string) => {
      setName(n);
      try {
        localStorage.setItem(NAME_KEY, n);
      } catch {}
    },
  ];
}

export type Settings = {
  exam_at: string;
  bets_close_at: string;
  result: number | null;
  result_note: string | null;
};

export function useSettings() {
  const [s, setS] = useState<Settings | null>(null);
  useEffect(() => {
    if (!supabaseConfigured()) return;
    sb()
      .from('settings')
      .select('exam_at,bets_close_at,result,result_note')
      .eq('id', 1)
      .single()
      .then(({ data }) => data && setS(data as Settings));
    const ch = sb()
      .channel('settings')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, (p) =>
        setS(p.new as Settings),
      )
      .subscribe();
    return () => {
      sb().removeChannel(ch);
    };
  }, []);
  return s;
}
