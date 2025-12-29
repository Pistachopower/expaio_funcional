
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  age int,
  is_spanish boolean,
  occupation text,
  studies text,
  canton text,
  permit text,
  arrival_date text,
  origin text,
  first_name text,
  last_name text,
  username text,
  purpose text,
  family_status text,
  avatar_url text,
  sector text
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for chatbots (bot configurations)
create table chatbots (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  name text not null,
  description text,
  system_prompt text,
  model text default 'gemini-1.5-flash',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for chatbots
alter table chatbots enable row level security;

create policy "Users can view their own chatbots."
  on chatbots for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own chatbots."
  on chatbots for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own chatbots."
  on chatbots for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own chatbots."
  on chatbots for delete
  using ( auth.uid() = user_id );

-- Create a table for messages (chat history)
create table messages (
  id uuid default gen_random_uuid() primary key,
  chatbot_id uuid references chatbots(id) on delete cascade,
  user_id uuid references profiles(id) not null, -- denormalized for easier RLS
  role text not null, -- 'user' or 'model'
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS for messages
alter table messages enable row level security;

create policy "Users can view their own messages."
  on messages for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own messages."
  on messages for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, first_name, last_name, username, avatar_url)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name', 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a table for checklist items
create table user_checklists (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  item_id text not null, -- The ID from the frontend (e.g., 'p1', 'l2')
  is_completed boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, item_id) -- Ensure one entry per item per user
);

-- Set up RLS for checklist
alter table user_checklists enable row level security;

create policy "Users can view their own checklist."
  on user_checklists for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own checklist items."
  on user_checklists for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own checklist items."
  on user_checklists for update
  using ( auth.uid() = user_id );
