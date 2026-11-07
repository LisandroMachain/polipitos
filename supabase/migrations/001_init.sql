-- Polipitos: esquema inicial
-- Identidad: cada visitante recibe una sesión anónima de Supabase (auth.uid()).

-- Configuración (una sola fila)
create table public.settings (
  id int primary key default 1 check (id = 1),
  exam_at timestamptz not null,
  bets_close_at timestamptz not null,
  result int check (result between 0 and 99),
  result_note text
);
insert into public.settings (id, exam_at, bets_close_at)
values (1, '2027-01-09 08:00-03', '2027-01-09 08:00-03');

alter table public.settings enable row level security;
create policy "settings: todos leen" on public.settings for select using (true);

create or replace function public.bets_open() returns boolean
language sql stable security definer set search_path = '' as $$
  select now() < bets_close_at and result is null from public.settings where id = 1
$$;

-- Apuestas: una por persona, editable hasta el cierre
create table public.bets (
  id bigint generated always as identity primary key,
  user_id uuid not null unique default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  guess int not null check (guess between 0 and 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.bets enable row level security;
create policy "bets: todos leen" on public.bets for select using (true);
create policy "bets: apuesto yo, antes del cierre" on public.bets for insert to authenticated
  with check (user_id = (select auth.uid()) and public.bets_open());
create policy "bets: cambio la mía, antes del cierre" on public.bets for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()) and public.bets_open());

-- Preguntas para la salida de la anestesia (moderadas)
create table public.questions (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 40),
  body text not null check (char_length(btrim(body)) between 3 and 280),
  status text not null default 'pendiente'
    check (status in ('pendiente', 'aprobada', 'rechazada', 'respondida')),
  answer text,
  created_at timestamptz not null default now()
);
create index on public.questions (user_id);
alter table public.questions enable row level security;
create policy "questions: veo aprobadas y las mías" on public.questions for select
  using (status in ('aprobada', 'respondida') or user_id = (select auth.uid()));
create policy "questions: propongo" on public.questions for insert to authenticated
  with check (user_id = (select auth.uid()) and status = 'pendiente' and answer is null);

-- Votos
create table public.votes (
  question_id bigint not null references public.questions on delete cascade,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  primary key (question_id, user_id)
);
create index on public.votes (user_id);
alter table public.votes enable row level security;
create policy "votes: todos leen" on public.votes for select using (true);
create policy "votes: voto yo" on public.votes for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy "votes: saco mi voto" on public.votes for delete to authenticated
  using (user_id = (select auth.uid()));

-- Tiempo real
alter publication supabase_realtime add table public.bets, public.questions, public.votes, public.settings;
