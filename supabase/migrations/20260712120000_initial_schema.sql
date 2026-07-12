-- SmartAc — initial Cloud (v2.0) schema
-- One business per auth.users row (auth.uid()). Every business-data table
-- carries user_id directly (rather than relying on joins) so RLS policies
-- stay simple and fast: `using (auth.uid() = user_id)`.
-- (Re-touched to trigger the Supabase GitHub integration against the
-- Frankfurt project, connected after the original push.)
-- (Re-touched again to exercise the new GitHub Actions deploy workflow.)

-- ── profiles (business settings — 1:1 with auth.users) ──
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  business_name text default '',
  business_type text default 'general',
  business_logo text,
  business_address text default '',
  business_tax_id text default '',
  business_phone text default '',
  business_email text default '',
  currency text default '€',
  lang text default 'en',
  theme text default 'light',
  date_format text default 'YYYY-MM-DD',
  invoice_template text default 'classic',
  notify_recurring boolean default true,
  notify_invoice_due boolean default true,
  bank_name text default '',
  bank_iban text default '',
  bank_bic text default '',
  bank_account_holder text default '',
  budget_income numeric(12,2),
  budget_expense numeric(12,2),
  created_at timestamptz not null default now()
);

-- ── transactions ──
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('income','expense')),
  name text not null,
  amount numeric(12,2) not null,
  category text,
  date date not null,
  vat_rate numeric(5,2) default 0,
  client_id uuid,
  client_name text,
  supplier_id uuid,
  supplier_name text,
  invoice_ref text,
  receipt_id uuid,
  product_id uuid,
  product_qty numeric(12,2),
  created_at timestamptz not null default now()
);
create index if not exists transactions_user_date_idx on transactions(user_id, date);

-- ── debts ──
create table if not exists debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person text not null,
  amount numeric(12,2) not null,
  category text,
  date date not null,
  status text not null default 'pending' check (status in ('pending','paid')),
  type text not null check (type in ('i-owe','owes-me')),
  client_id uuid,
  supplier_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists debts_user_idx on debts(user_id);

-- ── clients / suppliers ──
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text default '',
  phone text default '',
  email text default '',
  country text default '',
  address text default '',
  notes text default '',
  since date,
  created_at timestamptz not null default now()
);
create index if not exists clients_user_idx on clients(user_id);

create table if not exists suppliers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  company text default '',
  phone text default '',
  email text default '',
  country text default '',
  address text default '',
  notes text default '',
  since date,
  service_type text default '',
  created_at timestamptz not null default now()
);
create index if not exists suppliers_user_idx on suppliers(user_id);

-- ── employees + child tables ──
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  position text default '',
  salary numeric(12,2) default 0,
  phone text default '',
  email text default '',
  address text default '',
  nationality text default '',
  birth_date date,
  start_date date,
  notes text default '',
  created_at timestamptz not null default now()
);
create index if not exists employees_user_idx on employees(user_id);

create table if not exists employee_work_hours (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  start_time time,
  end_time time,
  break_minutes int default 0,
  hours numeric(6,2),
  created_at timestamptz not null default now()
);
create index if not exists emp_work_hours_employee_idx on employee_work_hours(employee_id);
create index if not exists emp_work_hours_user_idx on employee_work_hours(user_id);

create table if not exists employee_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references employees(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  expiry_date date,
  storage_path text,
  created_at timestamptz not null default now()
);
create index if not exists emp_documents_employee_idx on employee_documents(employee_id);
create index if not exists emp_documents_user_idx on employee_documents(user_id);

-- ── recurring expenses / fixed income ──
create table if not exists recurring (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  category text default 'Other',
  vat_rate numeric(5,2) default 0,
  day int default 1,
  last_recorded text,
  created_at timestamptz not null default now()
);
create index if not exists recurring_user_idx on recurring(user_id);

create table if not exists fixed_income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric(12,2) not null,
  category text default 'Other',
  vat_rate numeric(5,2) default 0,
  day int default 1,
  last_recorded text,
  created_at timestamptz not null default now()
);
create index if not exists fixed_income_user_idx on fixed_income(user_id);

-- ── installments (Ausschreibung — vehicles/assets bought on a schedule) ──
create table if not exists installments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  total_netto numeric(12,2) not null,
  vat_rate numeric(5,2) default 0,
  start_date date not null,
  total_months int not null,
  monthly_netto numeric(12,2) not null,
  months_posted int not null default 0,
  last_recorded text,
  linked_vehicle_id uuid,
  linked_asset_id uuid,
  status text not null default 'active' check (status in ('active','completed','stopped')),
  created_at timestamptz not null default now()
);
create index if not exists installments_user_idx on installments(user_id);

-- ── issued / received invoices ──
create table if not exists issued_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  number text,
  issue_date date,
  due_date date,
  items jsonb not null default '[]',
  vat_rate numeric(5,2) default 0,
  subtotal numeric(12,2) default 0,
  vat_amount numeric(12,2) default 0,
  total numeric(12,2) default 0,
  status text default 'Pending',
  currency text default '€',
  notes text default '',
  client_id uuid,
  client_name text,
  payment_method text,
  created_at timestamptz not null default now()
);
create index if not exists issued_invoices_user_idx on issued_invoices(user_id);

create table if not exists received_invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  number text,
  issue_date date,
  due_date date,
  items jsonb not null default '[]',
  vat_rate numeric(5,2) default 0,
  subtotal numeric(12,2) default 0,
  vat_amount numeric(12,2) default 0,
  total numeric(12,2) default 0,
  status text default 'Pending',
  currency text default '€',
  notes text default '',
  supplier_id uuid,
  supplier_name text,
  supplier_inv_num text,
  created_at timestamptz not null default now()
);
create index if not exists received_invoices_user_idx on received_invoices(user_id);

-- ── fleet (transport businesses) ──
create table if not exists fleet (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plate text,
  name text default '',
  type text default '',
  year text default '',
  notes text default '',
  acq_type text,
  asset_value numeric(12,2),
  asset_vat_rate numeric(5,2),
  asset_purchase_date date,
  installment_id uuid references installments(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists fleet_user_idx on fleet(user_id);

create table if not exists fleet_maintenance (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references fleet(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  category text,
  description text default '',
  cost numeric(12,2) default 0,
  created_at timestamptz not null default now()
);
create index if not exists fleet_maintenance_vehicle_idx on fleet_maintenance(vehicle_id);
create index if not exists fleet_maintenance_user_idx on fleet_maintenance(user_id);

-- ── general assets (Anlagevermögen) ──
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  value numeric(12,2) not null,
  purchase_date date,
  vat_rate numeric(5,2) default 0,
  installment_id uuid references installments(id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists assets_user_idx on assets(user_id);

-- ── inventory (retail businesses) ──
create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text default '',
  purchase_price numeric(12,2) default 0,
  sell_price numeric(12,2) default 0,
  quantity numeric(12,2) default 0,
  unit text default '',
  low_stock_threshold numeric(12,2),
  created_at timestamptz not null default now()
);
create index if not exists inventory_user_idx on inventory(user_id);

-- ── notes / appointments ──
create table if not exists notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default '',
  body text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists notes_user_idx on notes(user_id);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  date date not null,
  time time,
  notes text default '',
  created_at timestamptz not null default now()
);
create index if not exists appointments_user_idx on appointments(user_id);

-- ── UVA period approvals (Freigabe) ──
create table if not exists uva_freigaben (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_key text not null,
  approved_at timestamptz not null default now(),
  unique (user_id, period_key)
);
create index if not exists uva_freigaben_user_idx on uva_freigaben(user_id);

-- ── receipt metadata (actual files live in Supabase Storage, not the DB) ──
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  transaction_id uuid references transactions(id) on delete set null,
  name text,
  mime_type text,
  storage_path text,
  created_at timestamptz not null default now()
);
create index if not exists receipts_user_idx on receipts(user_id);

-- ══════════════════════════════════════════
-- Row Level Security — every table is private to its owner
-- ══════════════════════════════════════════
alter table profiles enable row level security;
alter table transactions enable row level security;
alter table debts enable row level security;
alter table clients enable row level security;
alter table suppliers enable row level security;
alter table employees enable row level security;
alter table employee_work_hours enable row level security;
alter table employee_documents enable row level security;
alter table recurring enable row level security;
alter table fixed_income enable row level security;
alter table installments enable row level security;
alter table issued_invoices enable row level security;
alter table received_invoices enable row level security;
alter table fleet enable row level security;
alter table fleet_maintenance enable row level security;
alter table assets enable row level security;
alter table inventory enable row level security;
alter table notes enable row level security;
alter table appointments enable row level security;
alter table uva_freigaben enable row level security;
alter table receipts enable row level security;

-- profiles: id IS the user's own auth uid, no separate user_id column
drop policy if exists "profiles_owner" on profiles;
create policy "profiles_owner" on profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- every other table: standard "owns via user_id" policy
-- (drop-then-create makes this block safe to re-run, since Postgres has no
-- "create policy if not exists")
do $$
declare
  t text;
begin
  foreach t in array array[
    'transactions','debts','clients','suppliers','employees',
    'employee_work_hours','employee_documents','recurring','fixed_income',
    'installments','issued_invoices','received_invoices','fleet',
    'fleet_maintenance','assets','inventory','notes','appointments',
    'uva_freigaben','receipts'
  ]
  loop
    execute format('drop policy if exists "%1$s_owner" on %1$s;', t);
    execute format(
      'create policy "%1$s_owner" on %1$s for all using (auth.uid() = user_id) with check (auth.uid() = user_id);',
      t
    );
  end loop;
end $$;

-- ══════════════════════════════════════════
-- Storage buckets for receipts / employee documents
-- ══════════════════════════════════════════
insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('employee-documents', 'employee-documents', false)
on conflict (id) do nothing;

-- Storage RLS: object path convention is "<user_id>/<filename>" so a user can
-- only reach objects prefixed with their own uid.
drop policy if exists "receipts_owner" on storage.objects;
create policy "receipts_owner" on storage.objects for all
  using (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'receipts' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "employee_documents_owner" on storage.objects;
create policy "employee_documents_owner" on storage.objects for all
  using (bucket_id = 'employee-documents' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'employee-documents' and auth.uid()::text = (storage.foldername(name))[1]);

-- ══════════════════════════════════════════
-- Auto-create a profile row whenever a new auth user signs up
-- ══════════════════════════════════════════
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
