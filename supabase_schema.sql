-- Drop tables if they exist (for clean setup)
drop table if exists public.gallery;
drop table if exists public.events;
drop table if exists public.announcements;
drop table if exists public.relationships;
drop table if exists public.family_members;
drop table if exists public.families;
drop table if exists public.profiles;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Families
create table public.families (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  location text,
  admin_id uuid references public.profiles(id) on delete set null,
  invite_token uuid default uuid_generate_v4(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Family Members
create table public.family_members (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  first_name text not null,
  last_name text not null,
  dob date,
  profession text,
  city text,
  bio text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Relationships
create table public.relationships (
  id uuid default uuid_generate_v4() primary key,
  member_id_1 uuid references public.family_members(id) on delete cascade not null,
  member_id_2 uuid references public.family_members(id) on delete cascade not null,
  relationship_type text not null check (relationship_type in ('parent', 'child', 'spouse', 'sibling')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(member_id_1, member_id_2, relationship_type)
);

-- 5. Announcements
create table public.announcements (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade not null,
  title text not null,
  description text not null,
  event_date timestamp with time zone,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Events
create table public.events (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade not null,
  title text not null,
  event_date timestamp with time zone not null,
  event_type text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Gallery
create table public.gallery (
  id uuid default uuid_generate_v4() primary key,
  family_id uuid references public.families(id) on delete cascade not null,
  title text not null,
  description text,
  photo_url text not null,
  date date,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.relationships enable row level security;
alter table public.announcements enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;

-- Profiles policies
create policy "Users can view own profile" 
on public.profiles for select 
using ( auth.uid() = id );

create policy "Users can update own profile" 
on public.profiles for update 
using ( auth.uid() = id );

create policy "Users can insert own profile" 
on public.profiles for insert 
with check ( auth.uid() = id );

-- Families policies
create policy "Users view families they belong to"
on public.families for select
using (
exists (
select 1 from public.family_members 
where family_members.family_id = families.id 
and family_members.user_id = auth.uid()
)
);

create policy "Users can create a family space"
on public.families for insert
with check ( auth.uid() is not null );

create policy "Admin can update family"
on public.families for update
using ( admin_id = auth.uid() );

-- Family members policies
create policy "Users view members of their families"
on public.family_members for select
using (
exists (
select 1 from public.family_members as my_members 
where my_members.family_id = family_members.family_id 
and my_members.user_id = auth.uid()
)
or
exists (
select 1 from public.families
where families.id = family_members.family_id
and families.admin_id = auth.uid()
)
);

create policy "Users can insert members into their families"
on public.family_members for insert
with check (
exists (
select 1 from public.families
where families.id = family_members.family_id
and families.admin_id = auth.uid()
)
or
exists (
select 1 from public.family_members as my_members 
where my_members.family_id = family_members.family_id 
and my_members.user_id = auth.uid()
)
);

-- Helper function
create or replace function public.is_in_family(f_id uuid)
returns boolean
language sql security definer
as $$
select exists (
select 1 
from public.family_members 
where family_id = f_id 
and user_id = auth.uid()
) 
or exists (
select 1
from public.families
where id = f_id
and admin_id = auth.uid()
);
$$;

-- Relationships policies
create policy "View family relationships" 
on public.relationships for select
using (
public.is_in_family((select family_id from public.family_members where id = member_id_1))
);

create policy "Insert family relationships" 
on public.relationships for insert
with check (
public.is_in_family((select family_id from public.family_members where id = member_id_1))
);

-- Announcements policies
create policy "View family announcements" 
on public.announcements for select 
using (public.is_in_family(family_id));

create policy "Insert family announcements" 
on public.announcements for insert 
with check (public.is_in_family(family_id));

-- Events policies
create policy "View family events" 
on public.events for select 
using (public.is_in_family(family_id));

create policy "Insert family events" 
on public.events for insert 
with check (public.is_in_family(family_id));

-- Gallery policies
create policy "View family gallery" 
on public.gallery for select 
using (public.is_in_family(family_id));

create policy "Insert family gallery" 
on public.gallery for insert 
with check (public.is_in_family(family_id));

-- Trigger for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
insert into public.profiles (id, first_name, last_name, avatar_url)
values (
new.id, 
new.raw_user_meta_data->>'first_name', 
new.raw_user_meta_data->>'last_name',
new.raw_user_meta_data->>'avatar_url'
);
return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();