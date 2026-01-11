/*
  # Create Campus Marketplace Schema

  ## Overview
  This migration creates the complete database schema for a college marketplace and PG finder platform.

  ## 1. New Tables
  
  ### `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `email` (text, unique, not null)
  - `full_name` (text, not null)
  - `college_name` (text, not null)
  - `phone` (text)
  - `avatar_url` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `categories`
  - `id` (uuid, primary key)
  - `name` (text, unique, not null)
  - `icon` (text)
  - `created_at` (timestamptz)
  
  ### `marketplace_listings`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `category_id` (uuid, references categories)
  - `title` (text, not null)
  - `description` (text, not null)
  - `price` (numeric, not null)
  - `images` (text array)
  - `condition` (text, not null)
  - `status` (text, default 'available')
  - `location` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### `pg_accommodations`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `title` (text, not null)
  - `description` (text, not null)
  - `address` (text, not null)
  - `latitude` (numeric, not null)
  - `longitude` (numeric, not null)
  - `rent_per_month` (numeric, not null)
  - `amenities` (text array)
  - `room_type` (text, not null)
  - `images` (text array)
  - `contact_phone` (text, not null)
  - `available_from` (date)
  - `gender_preference` (text)
  - `status` (text, default 'available')
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## 2. Security
  
  - Enable RLS on all tables
  - Add policies for authenticated users to:
    - Read all listings and PG accommodations
    - Create their own listings
    - Update/delete only their own listings
    - Read all profiles
    - Update only their own profile

  ## 3. Notes
  
  - All timestamps use timestamptz for timezone awareness
  - UUIDs for primary keys ensure scalability
  - Status fields allow for soft deletion and moderation
  - Location data stored for filtering and map display
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  college_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  icon text,
  created_at timestamptz DEFAULT now()
);

-- Create marketplace_listings table
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  images text[] DEFAULT '{}',
  condition text NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
  location text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create pg_accommodations table
CREATE TABLE IF NOT EXISTS pg_accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  address text NOT NULL,
  latitude numeric NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude numeric NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  rent_per_month numeric NOT NULL CHECK (rent_per_month >= 0),
  amenities text[] DEFAULT '{}',
  room_type text NOT NULL CHECK (room_type IN ('single', 'double', 'triple', 'shared')),
  images text[] DEFAULT '{}',
  contact_phone text NOT NULL,
  available_from date,
  gender_preference text CHECK (gender_preference IN ('male', 'female', 'any')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'occupied')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
  ('Electronics', 'Laptop'),
  ('Books', 'BookOpen'),
  ('Furniture', 'Armchair'),
  ('Clothing', 'Shirt'),
  ('Sports', 'Bike'),
  ('Other', 'Package')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pg_accommodations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can read profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Categories policies (read-only for all authenticated users)
CREATE POLICY "Anyone can read categories"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

-- Marketplace listings policies
CREATE POLICY "Anyone can read marketplace listings"
  ON marketplace_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own listings"
  ON marketplace_listings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listings"
  ON marketplace_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own listings"
  ON marketplace_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- PG accommodations policies
CREATE POLICY "Anyone can read PG accommodations"
  ON pg_accommodations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own PG listings"
  ON pg_accommodations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own PG listings"
  ON pg_accommodations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own PG listings"
  ON pg_accommodations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_user_id ON marketplace_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_category_id ON marketplace_listings(category_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_listings_created_at ON marketplace_listings(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_pg_accommodations_user_id ON pg_accommodations(user_id);
CREATE INDEX IF NOT EXISTS idx_pg_accommodations_status ON pg_accommodations(status);
CREATE INDEX IF NOT EXISTS idx_pg_accommodations_location ON pg_accommodations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_pg_accommodations_created_at ON pg_accommodations(created_at DESC);
