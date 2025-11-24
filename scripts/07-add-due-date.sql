-- Add due_date column to requests table
ALTER TABLE requests ADD COLUMN due_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days');

-- Create index for due_date for efficient filtering
CREATE INDEX idx_requests_due_date ON requests(due_date);
