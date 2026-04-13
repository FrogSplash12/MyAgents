-- VakilSahayak: Initial Database Schema
-- Run this in Supabase SQL Editor to set up all tables.
-- All timestamps use timestamptz. UUIDs are generated server-side.

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. USERS
-- ============================================================
create table public.users (
  id            uuid primary key default uuid_generate_v4(),
  phone         text not null unique,
  name          text,
  referral_source text,
  city          text,
  language      text default 'en',
  status        text not null default 'new_lead'
                  check (status in ('new_lead','onboarding','active','churned','blocked')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_users_phone on public.users (phone);
create index idx_users_status on public.users (status);

-- ============================================================
-- 2. SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  plan          text not null default 'trial'
                  check (plan in ('trial','monthly','yearly')),
  status        text not null default 'pending'
                  check (status in ('pending','active','expired','cancelled')),
  started_at    timestamptz,
  expires_at    timestamptz,
  payment_ref   text,
  created_at    timestamptz not null default now()
);

create index idx_subscriptions_user on public.subscriptions (user_id);
create index idx_subscriptions_status on public.subscriptions (status);

-- ============================================================
-- 3. CONVERSATION SESSIONS
-- ============================================================
create table public.conversation_sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  state         text not null default 'NEW_LEAD',
  context       jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_sessions_user on public.conversation_sessions (user_id);
create index idx_sessions_state on public.conversation_sessions (state);

-- ============================================================
-- 4. MESSAGES
-- ============================================================
create table public.messages (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.users(id) on delete cascade,
  session_id          uuid references public.conversation_sessions(id) on delete set null,
  direction           text not null check (direction in ('inbound','outbound')),
  channel             text not null default 'whatsapp',
  channel_message_id  text,
  body                text,
  media_url           text,
  created_at          timestamptz not null default now()
);

create index idx_messages_user on public.messages (user_id);
create index idx_messages_session on public.messages (session_id);
create index idx_messages_created on public.messages (created_at desc);

-- ============================================================
-- 5. JOBS
-- ============================================================
create table public.jobs (
  id            uuid primary key default uuid_generate_v4(),
  type          text not null,
  status        text not null default 'pending'
                  check (status in ('pending','running','completed','failed','cancelled')),
  payload       jsonb not null default '{}'::jsonb,
  result        jsonb,
  attempts      int not null default 0,
  max_attempts  int not null default 3,
  next_run_at   timestamptz not null default now(),
  locked_until  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_jobs_status on public.jobs (status);
create index idx_jobs_next_run on public.jobs (next_run_at) where status = 'pending';
create index idx_jobs_type on public.jobs (type);

-- ============================================================
-- 6. AUDIT LOGS
-- ============================================================
create table public.audit_logs (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references public.users(id) on delete set null,
  action        text not null,
  detail        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index idx_audit_user on public.audit_logs (user_id);
create index idx_audit_action on public.audit_logs (action);
create index idx_audit_created on public.audit_logs (created_at desc);

-- ============================================================
-- 7. IDEMPOTENCY KEYS
-- ============================================================
create table public.idempotency_keys (
  id            uuid primary key default uuid_generate_v4(),
  key           text not null unique,
  response      jsonb,
  created_at    timestamptz not null default now(),
  expires_at    timestamptz not null default (now() + interval '24 hours')
);

create index idx_idempotency_key on public.idempotency_keys (key);
create index idx_idempotency_expires on public.idempotency_keys (expires_at);

-- ============================================================
-- 8. CASES
-- ============================================================
create table public.cases (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references public.users(id) on delete cascade,
  cnr_number      text not null,
  title           text,
  court           text,
  status          text not null default 'active'
                    check (status in ('active','closed','archived')),
  last_checked_at timestamptz,
  data            jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_cases_user on public.cases (user_id);
create index idx_cases_cnr on public.cases (cnr_number);
create unique index idx_cases_user_cnr on public.cases (user_id, cnr_number);

-- ============================================================
-- 9. DOCUMENTS
-- ============================================================
create table public.documents (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.users(id) on delete cascade,
  case_id       uuid references public.cases(id) on delete set null,
  filename      text not null,
  storage_path  text not null,
  mime_type     text,
  size_bytes    bigint,
  summary       text,
  created_at    timestamptz not null default now()
);

create index idx_documents_user on public.documents (user_id);
create index idx_documents_case on public.documents (case_id);

-- ============================================================
-- AUTO-UPDATE TIMESTAMPS
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.update_updated_at();

create trigger trg_sessions_updated_at
  before update on public.conversation_sessions
  for each row execute function public.update_updated_at();

create trigger trg_jobs_updated_at
  before update on public.jobs
  for each row execute function public.update_updated_at();

create trigger trg_cases_updated_at
  before update on public.cases
  for each row execute function public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (enable, but allow service role full access)
-- ============================================================
alter table public.users enable row level security;
alter table public.subscriptions enable row level security;
alter table public.conversation_sessions enable row level security;
alter table public.messages enable row level security;
alter table public.jobs enable row level security;
alter table public.audit_logs enable row level security;
alter table public.idempotency_keys enable row level security;
alter table public.cases enable row level security;
alter table public.documents enable row level security;

-- Service role bypass policies (the app uses the service role key)
create policy "service_role_all" on public.users for all using (true) with check (true);
create policy "service_role_all" on public.subscriptions for all using (true) with check (true);
create policy "service_role_all" on public.conversation_sessions for all using (true) with check (true);
create policy "service_role_all" on public.messages for all using (true) with check (true);
create policy "service_role_all" on public.jobs for all using (true) with check (true);
create policy "service_role_all" on public.audit_logs for all using (true) with check (true);
create policy "service_role_all" on public.idempotency_keys for all using (true) with check (true);
create policy "service_role_all" on public.cases for all using (true) with check (true);
create policy "service_role_all" on public.documents for all using (true) with check (true);

-- ============================================================
-- CLEANUP: Expired idempotency keys (run periodically or via cron)
-- ============================================================
-- delete from public.idempotency_keys where expires_at < now();
