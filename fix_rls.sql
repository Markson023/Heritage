-- DROP old recursive policies
drop policy if exists "Users view families they belong to" on public.families;
drop policy if exists "Users view members of their families" on public.family_members;
drop policy if exists "Users can insert members into their families" on public.family_members;

-- Helper function (updating it to set search_path for safety but keeping security definer to bypass RLS)
create or replace function public.is_in_family(f_id uuid)
returns boolean
language sql security definer set search_path = public
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

-- CREATE fixed policies
create policy "Users view families they belong to"
on public.families for select
using (
  admin_id = auth.uid() or public.is_in_family(id)
);

create policy "Users view members of their families"
on public.family_members for select
using (
  user_id = auth.uid() or public.is_in_family(family_id)
);

create policy "Users can insert members into their families"
on public.family_members for insert
with check (
  public.is_in_family(family_id)
);
