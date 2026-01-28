-- Drop the table if it exists to ensure we start fresh with the correct schema
drop table if exists community_reports;

-- Create a table for community reports
create table community_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  content text not null,
  platform text not null,
  scam_type text,
  likes int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table community_reports enable row level security;

create policy "Everyone can view community reports."
  on community_reports for select
  using ( true );

create policy "Authenticated users can insert community reports."
  on community_reports for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own community reports."
  on community_reports for delete
  using ( auth.uid() = user_id );
