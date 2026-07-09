-- Run this in the Supabase SQL editor to set up the plans table

create table if not exists plans (
  id text primary key,
  created_at timestamptz default now(),
  "personA" jsonb not null,
  "personB" jsonb,
  result jsonb
);

-- Allow public read/write (no auth required for MVP)
alter table plans enable row level security;

create policy "Allow public insert" on plans
  for insert with check (true);

create policy "Allow public select" on plans
  for select using (true);

create policy "Allow public update" on plans
  for update using (true) with check (true);
