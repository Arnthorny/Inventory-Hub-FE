-- Seed script to create a default admin user
-- Run this in your Supabase SQL editor to set up an admin account for testing

-- First, insert the admin user directly into the users table
-- This bypasses the need for Supabase Auth during seeding
INSERT INTO users (id, email, name, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Static UUID for admin
  'admin@designstudio.local',
  'Admin User',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Alternative: If you want to create an admin through normal signup flow:
-- 1. Sign up with any email via the UI
-- 2. Run this query to update their role to admin:
-- UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';

-- Verify the admin user was created
SELECT id, email, name, role FROM users WHERE role = 'admin';
