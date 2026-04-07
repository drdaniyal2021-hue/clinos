-- ============================================================
-- ClinOS RLS Policies — Migration 002
-- Row Level Security: users can only access their own data
-- ============================================================

-- ─── Enable RLS on all tables ─────────────────────────────
alter table public.profiles            enable row level security;
alter table public.encounters          enable row level security;
alter table public.encounter_steps     enable row level security;
alter table public.calculator_results  enable row level security;
alter table public.encounter_audit_log enable row level security;
alter table public.conditions          enable row level security;

-- ─── PROFILES ─────────────────────────────────────────────
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─── ENCOUNTERS ───────────────────────────────────────────
create policy "Users can view own encounters"
  on public.encounters for select
  using (auth.uid() = user_id);

create policy "Users can create encounters"
  on public.encounters for insert
  with check (auth.uid() = user_id);

create policy "Users can update own encounters"
  on public.encounters for update
  using (auth.uid() = user_id);

-- ─── ENCOUNTER STEPS ──────────────────────────────────────
create policy "Users can view steps for own encounters"
  on public.encounter_steps for select
  using (
    exists (
      select 1 from public.encounters e
      where e.id = encounter_steps.encounter_id
      and e.user_id = auth.uid()
    )
  );

create policy "Users can create steps for own encounters"
  on public.encounter_steps for insert
  with check (
    exists (
      select 1 from public.encounters e
      where e.id = encounter_steps.encounter_id
      and e.user_id = auth.uid()
    )
  );

create policy "Users can update steps for own encounters"
  on public.encounter_steps for update
  using (
    exists (
      select 1 from public.encounters e
      where e.id = encounter_steps.encounter_id
      and e.user_id = auth.uid()
    )
  );

-- ─── CALCULATOR RESULTS ───────────────────────────────────
create policy "Users can manage calculator results for own encounters"
  on public.calculator_results for all
  using (
    exists (
      select 1 from public.encounters e
      where e.id = calculator_results.encounter_id
      and e.user_id = auth.uid()
    )
  );

-- ─── AUDIT LOG ────────────────────────────────────────────
create policy "Users can view own audit log"
  on public.encounter_audit_log for select
  using (auth.uid() = user_id);

create policy "Users can insert own audit log"
  on public.encounter_audit_log for insert
  with check (auth.uid() = user_id);

-- No update or delete on audit log — immutable by policy

-- ─── CONDITIONS (public read, no write for users) ─────────
create policy "Anyone can read conditions"
  on public.conditions for select
  to authenticated, anon
  using (active = true);
