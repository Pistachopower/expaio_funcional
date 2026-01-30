-- Migration: Make profiles private (only owner can view)

drop policy if exists "Public profiles are viewable by everyone." on profiles;

create policy "Users can view their own profile."
  on profiles for select
  using (auth.uid() = id);
