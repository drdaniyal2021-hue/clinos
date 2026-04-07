-- ============================================================
-- ClinOS Database Schema — Migration 001: Initial
-- ============================================================
-- Run this in Supabase SQL Editor (Project > SQL Editor > New Query)
-- ============================================================

-- ─── Extensions ───────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ─── PROFILES ─────────────────────────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  role        text not null default 'junior_doctor'
                check (role in ('junior_doctor','medical_student','registrar','consultant')),
  specialty   text,
  hospital    text,
  country     text,
  onboarded   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table public.profiles is 'Clinical user profiles extending auth.users';

-- ─── ENCOUNTERS ───────────────────────────────────────────
create table public.encounters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  patient_age     int check (patient_age between 0 and 130),
  patient_sex     text check (patient_sex in ('male','female','other','unknown')),
  chief_complaint text not null,
  condition_key   text not null default 'chest_pain',
  mode            text not null default 'er'
                    check (mode in ('er','ward','icu')),
  severity        text not null default 'unknown'
                    check (severity in ('critical','unstable','stable','unknown')),
  critical_mode   boolean not null default false,
  current_step    text not null default 'triage'
                    check (current_step in (
                      'triage','history','examination','investigations',
                      'differentials','diagnosis','management','documentation'
                    )),
  status          text not null default 'active'
                    check (status in ('active','completed','abandoned')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz,
  updated_at      timestamptz not null default now()
);

comment on table public.encounters is 'One row per patient encounter — full 8-step workflow session';

create index encounters_user_id_idx    on public.encounters(user_id);
create index encounters_status_idx     on public.encounters(status);
create index encounters_created_at_idx on public.encounters(created_at desc);

-- ─── ENCOUNTER STEPS ──────────────────────────────────────
create table public.encounter_steps (
  id            uuid primary key default gen_random_uuid(),
  encounter_id  uuid not null references public.encounters(id) on delete cascade,
  step          text not null
                  check (step in (
                    'triage','history','examination','investigations',
                    'differentials','diagnosis','management','documentation'
                  )),
  data          jsonb not null default '{}'::jsonb,
  ai_output     jsonb          default '{}'::jsonb,
  safety_flags  jsonb          default '[]'::jsonb,
  completed_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (encounter_id, step)
);

comment on table public.encounter_steps is 'One row per step per encounter. JSONB data is flexible per step type.';
create index encounter_steps_encounter_id_idx on public.encounter_steps(encounter_id);

-- ─── CALCULATOR RESULTS ───────────────────────────────────
create table public.calculator_results (
  id            uuid primary key default gen_random_uuid(),
  encounter_id  uuid not null references public.encounters(id) on delete cascade,
  calculator    text not null,
  inputs        jsonb not null default '{}'::jsonb,
  result        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index calculator_results_encounter_id_idx on public.calculator_results(encounter_id);

-- ─── AUDIT LOG ────────────────────────────────────────────
create table public.encounter_audit_log (
  id            uuid primary key default gen_random_uuid(),
  encounter_id  uuid references public.encounters(id) on delete set null,
  user_id       uuid references public.profiles(id) on delete set null,
  action        text not null,
  step          text,
  payload       jsonb default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

comment on table public.encounter_audit_log is 'Immutable safety audit trail. Never delete rows.';
create index audit_log_encounter_id_idx on public.encounter_audit_log(encounter_id);
create index audit_log_created_at_idx   on public.encounter_audit_log(created_at desc);

-- ─── CONDITIONS REGISTRY ──────────────────────────────────
create table public.conditions (
  key          text primary key,
  display_name text not null,
  category     text not null,
  phase        int not null default 2 check (phase in (1,2,3)),
  active       boolean not null default true,
  guidelines   text[] default '{}',
  created_at   timestamptz not null default now()
);

insert into public.conditions (key, display_name, category, phase, guidelines) values
  ('chest_pain',            'Chest Pain',                 'Cardiology',      1, '{AHA/ACC,ESC,NICE}'),
  ('shortness_of_breath',   'Shortness of Breath',        'Respiratory',     2, '{NICE,BTS,GOLD}'),
  ('syncope',               'Syncope / Collapse',         'Cardiology',      2, '{ESC,AHA}'),
  ('abdominal_pain',        'Acute Abdominal Pain',       'General Surgery', 2, '{NICE}'),
  ('headache',              'Acute Headache',             'Neurology',       2, '{NICE,AAN}'),
  ('fever',                 'Fever / Sepsis',             'Infectious',      2, '{Surviving Sepsis,WHO}'),
  ('altered_consciousness', 'Altered Consciousness',      'Neurology',       2, '{AHA,NICE}'),
  ('stroke_tia',            'Stroke / TIA',               'Neurology',       2, '{ESC,AHA,NICE}'),
  ('back_pain',             'Acute Back Pain',            'Musculoskeletal', 2, '{NICE}'),
  ('palpitations',          'Palpitations',               'Cardiology',      2, '{ESC,AHA}'),
  ('leg_pain_swelling',     'Leg Pain / Swelling (DVT)',  'Haematology',     2, '{NICE,ESC}'),
  ('urinary_symptoms',      'Urinary Symptoms / AKI',    'Nephrology',      2, '{NICE,KDIGO}'),
  ('gi_bleed',              'GI Bleeding',                'Gastroenterology',2, '{NICE,BSG}'),
  ('anaphylaxis',           'Anaphylaxis',                'Emergency',       2, '{NICE,WAO}'),
  ('trauma',                'Major Trauma',               'Emergency',       2, '{ATLS,NICE}'),
  ('hypoglycaemia',         'Hypoglycaemia',              'Endocrinology',   3, '{NICE,ADA}'),
  ('hypertensive_crisis',   'Hypertensive Crisis',        'Cardiology',      3, '{ESC,AHA}'),
  ('obs_emergency',         'Obstetric Emergency',        'Obstetrics',      3, '{NICE,WHO}'),
  ('paediatric_emergency',  'Paediatric Emergency',       'Paediatrics',     3, '{NICE,APLS}'),
  ('psychiatric_emergency', 'Psychiatric Emergency',      'Psychiatry',      3, '{NICE,APA}');

-- ─── TRIGGERS: updated_at ─────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger encounters_updated_at
  before update on public.encounters
  for each row execute function public.handle_updated_at();

create trigger encounter_steps_updated_at
  before update on public.encounter_steps
  for each row execute function public.handle_updated_at();

-- ─── TRIGGER: auto-create profile on signup ───────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
