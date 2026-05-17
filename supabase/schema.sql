-- CampusLoop Supabase Schema

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  avatar_url text,
  school text,
  campus text,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create listings table
create table listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references profiles(id) on delete cascade not null,
  title text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  category text not null,
  condition text not null, -- 'New', 'Like New', 'Used', 'Heavily Used'
  location text not null,
  status text default 'active' not null, -- 'active', 'sold', 'hidden', 'flagged'
  is_flagged boolean default false,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table listings enable row level security;

create policy "Listings are viewable by everyone." on listings
  for select using (true);

create policy "Users can create listings." on listings
  for insert with check (auth.uid() = seller_id);

create policy "Users can update own listings." on listings
  for update using (auth.uid() = seller_id);

create policy "Users can delete own listings." on listings
  for delete using (auth.uid() = seller_id);

-- Create listing_images table
create table listing_images (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  image_url text not null,
  position integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table listing_images enable row level security;

create policy "Listing images are viewable by everyone." on listing_images
  for select using (true);

create policy "Users can insert images for their own listings." on listing_images
  for insert with check (
    exists (
      select 1 from listings
      where id = listing_id and seller_id = auth.uid()
    )
  );

create policy "Users can delete images for their own listings." on listing_images
  for delete using (
    exists (
      select 1 from listings
      where id = listing_id and seller_id = auth.uid()
    )
  );

-- Create bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  listing_id uuid references listings(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, listing_id)
);

alter table bookmarks enable row level security;

create policy "Users can view their own bookmarks." on bookmarks
  for select using (auth.uid() = user_id);

create policy "Users can create their own bookmarks." on bookmarks
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks." on bookmarks
  for delete using (auth.uid() = user_id);

-- Create chats table
create table chats (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references listings(id) on delete cascade not null,
  buyer_id uuid references profiles(id) on delete cascade not null,
  seller_id uuid references profiles(id) on delete cascade not null,
  last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(listing_id, buyer_id, seller_id)
);

alter table chats enable row level security;

create policy "Users can view their own chats." on chats
  for select using (auth.uid() = buyer_id or auth.uid() = seller_id);

create policy "Users can create chats." on chats
  for insert with check (auth.uid() = buyer_id);

-- Create messages table
create table messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

create policy "Users can view messages in their chats." on messages
  for select using (
    exists (
      select 1 from chats
      where id = chat_id and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

create policy "Users can send messages in their chats." on messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from chats
      where id = chat_id and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
  );

-- Function to handle new user profiles
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user profiles
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles for each row execute procedure update_updated_at_column();
create trigger update_listings_updated_at before update on listings for each row execute procedure update_updated_at_column();
create trigger update_chats_updated_at before update on chats for each row execute procedure update_updated_at_column();
create trigger update_messages_updated_at before update on messages for each row execute procedure update_updated_at_column();
