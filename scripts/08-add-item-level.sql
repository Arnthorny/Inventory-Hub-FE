-- Add level column to items table
ALTER TABLE items ADD COLUMN level TEXT NOT NULL DEFAULT 'admin' CHECK (level IN ('admin', 'staff', 'intern', 'guest'));

-- Update existing seed items with appropriate levels
-- High-security items require admin
UPDATE items SET level = 'admin' WHERE category IN ('Computer', 'Server Equipment');

-- Mid-level items available to staff and up
UPDATE items SET level = 'staff' WHERE category IN ('Lighting', 'Audio Equipment', 'Props');

-- Common items available to interns and up
UPDATE items SET level = 'intern' WHERE category IN ('Studio Setup', 'Photography Equipment', 'Design Tools');

-- Create index for performance
CREATE INDEX idx_items_level ON items(level);
