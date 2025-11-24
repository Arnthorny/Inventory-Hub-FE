-- Drop existing request RLS policies
DROP POLICY IF EXISTS "Users can view their own requests" ON requests;
DROP POLICY IF EXISTS "Users can create their own requests" ON requests;
DROP POLICY IF EXISTS "Admin and staff can update requests" ON requests;

-- Recreate with corrected policies
-- Allow users to view their own requests, and staff/admin to view all
CREATE POLICY "Users can view their own requests" ON requests FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Allow authenticated users to create their own requests
CREATE POLICY "Authenticated users can create requests" ON requests FOR INSERT WITH CHECK (
  auth.uid() = user_id
);

-- Allow admin and staff to update request status
CREATE POLICY "Admin and staff can update requests" ON requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
);

-- Drop existing request_items policies
DROP POLICY IF EXISTS "Authenticated users can view request items" ON request_items;
DROP POLICY IF EXISTS "Users can create request items for their requests" ON request_items;

-- Recreate request_items policies
CREATE POLICY "View request items" ON request_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM requests 
    WHERE requests.id = request_items.request_id AND (
      requests.user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    )
  )
);

CREATE POLICY "Create request items" ON request_items FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM requests 
    WHERE requests.id = request_id AND (
      requests.user_id = auth.uid() OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'staff'))
    )
  )
);
