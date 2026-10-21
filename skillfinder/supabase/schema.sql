-- SkillFinder schema. Run once: Supabase > SQL Editor > New query > paste > Run.
-- If you ran the older schema, delete the old tables first (Table Editor) or use a fresh project.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role text not null default 'customer' check (role in ('artisan','customer')),
  trade text, city text, bio text, avatar_url text,
  created_at timestamptz not null default now()
);
create table public.services (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, description text,
  price numeric(10,2) not null check (price >= 0), -- shown as "From R..." on the profile
  created_at timestamptz not null default now()
);
create table public.work_items (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, image_url text,
  kind text not null default 'past' check (kind in ('past','new')),
  created_at timestamptz not null default now()
);
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  title text not null, company text, years text
);
create table public.educations (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  school text not null, qualification text, year text
);
create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  preferred_date date not null, message text, customer_phone text,
  status text not null default 'pending' check (status in ('pending','accepted','declined')),
  created_at timestamptz not null default now()
);
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5), comment text,
  created_at timestamptz not null default now(),
  unique (artisan_id, customer_id)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

-- Card data for the home page: average rating + review count
create view public.artisan_cards with (security_invoker = true) as
  select p.id, p.full_name, p.trade, p.city, p.avatar_url,
         coalesce(round(avg(r.rating), 2), 0)::float as rating, count(r.id)::int as review_count
  from public.profiles p left join public.reviews r on r.artisan_id = p.id
  where p.role = 'artisan' group by p.id;

-- ONE-WAY REGISTRATION: the account type is chosen at sign-up and can never change
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''),
          case when new.raw_user_meta_data->>'role' = 'artisan' then 'artisan' else 'customer' end);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create function public.lock_role() returns trigger language plpgsql as $$
begin
  if new.role <> old.role then raise exception 'Account type cannot be changed'; end if;
  return new;
end; $$;
create trigger profiles_lock_role before update on public.profiles
  for each row execute function public.lock_role();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.reviews enable row level security;
alter table public.messages enable row level security;

create policy "profiles: public read" on public.profiles for select using (true);
create policy "profiles: edit own" on public.profiles for update using (auth.uid() = id);

do $$ declare t text; begin
  foreach t in array array['services','work_items','experiences','educations'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "%s: public read" on public.%I for select using (true)', t, t);
    execute format('create policy "%s: owner writes" on public.%I for all using (auth.uid() = artisan_id) with check (auth.uid() = artisan_id)', t, t);
  end loop;
end $$;

create policy "bookings: customer or artisan reads" on public.bookings for select using (
  auth.uid() = customer_id
  or exists (select 1 from public.services s where s.id = bookings.service_id and s.artisan_id = auth.uid()));
create policy "bookings: customer creates" on public.bookings for insert
  with check (auth.uid() = customer_id and status = 'pending');
create policy "bookings: artisan updates status" on public.bookings for update
  using (exists (select 1 from public.services s where s.id = bookings.service_id and s.artisan_id = auth.uid()));

-- Only customers with an ACCEPTED booking can review (no fake reviews)
create policy "reviews: public read" on public.reviews for select using (true);
create policy "reviews: verified customers write" on public.reviews for insert with check (
  auth.uid() = customer_id and exists (
    select 1 from public.bookings b join public.services s on s.id = b.service_id
    where b.customer_id = auth.uid() and s.artisan_id = reviews.artisan_id and b.status = 'accepted'));

-- Messages: only the two people on a booking
create policy "messages: participants read" on public.messages for select using (exists (
  select 1 from public.bookings b join public.services s on s.id = b.service_id
  where b.id = messages.booking_id and (b.customer_id = auth.uid() or s.artisan_id = auth.uid())));
create policy "messages: participants send" on public.messages for insert with check (
  sender_id = auth.uid() and exists (
  select 1 from public.bookings b join public.services s on s.id = b.service_id
  where b.id = messages.booking_id and (b.customer_id = auth.uid() or s.artisan_id = auth.uid())));

-- Photos: public bucket, each user may only write inside their own folder
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true) on conflict do nothing;
create policy "portfolio: public read" on storage.objects for select using (bucket_id = 'portfolio');
create policy "portfolio: upload to own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "portfolio: delete own" on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
