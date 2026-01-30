-- Create a table for gratitude journal entries
create table if not exists gratitude_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  content text[] not null, -- Array of strings for the 3 things
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table gratitude_entries enable row level security;

create policy "Users can view their own gratitude entries."
  on gratitude_entries for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own gratitude entries."
  on gratitude_entries for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own gratitude entries."
  on gratitude_entries for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own gratitude entries."
  on gratitude_entries for delete
  using ( auth.uid() = user_id );
