-- Drop the problematic RLS policies on items
DROP POLICY IF EXISTS "Authenticated users can view items" ON items;
DROP POLICY IF EXISTS "Only admin can insert items" ON items;
DROP POLICY IF EXISTS "Only admin can update items" ON items;
DROP POLICY IF EXISTS "Only admin can delete items" ON items;

-- Recreate with correct policies
-- Allow all authenticated users to view items (no restrictions)
CREATE POLICY "All authenticated users can view items" ON items FOR SELECT USING (true);

-- Only allow authenticated users with admin role to insert items
CREATE POLICY "Admin users can insert items" ON items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Only allow authenticated users with admin role to update items
CREATE POLICY "Admin users can update items" ON items FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- Only allow authenticated users with admin role to delete items
CREATE POLICY "Admin users can delete items" ON items FOR DELETE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);
