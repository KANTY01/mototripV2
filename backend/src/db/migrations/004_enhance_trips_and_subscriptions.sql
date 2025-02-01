-- Add new columns to trips table
ALTER TABLE trips ADD COLUMN is_premium BOOLEAN DEFAULT FALSE;
ALTER TABLE trips ADD COLUMN status TEXT DEFAULT 'draft';
ALTER TABLE trips ADD COLUMN terrain TEXT;
ALTER TABLE trips ADD COLUMN route_points JSON;
ALTER TABLE trips ADD COLUMN start_location JSON;

-- Add order field to trip_images for reordering
ALTER TABLE trip_images ADD COLUMN display_order INTEGER DEFAULT 0;

-- Enhance subscriptions table
ALTER TABLE subscriptions ADD COLUMN payment_method JSON;
ALTER TABLE subscriptions ADD COLUMN auto_renew BOOLEAN DEFAULT FALSE;
ALTER TABLE subscriptions ADD COLUMN plan_type TEXT DEFAULT 'basic';
ALTER TABLE subscriptions ADD COLUMN payment_history JSON;

-- Create billing_history table
CREATE TABLE billing_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  subscription_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  payment_method JSON,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id)
);

-- Create statistics table for caching
CREATE TABLE statistics_cache (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stat_type TEXT NOT NULL,
  stat_data JSON NOT NULL,
  date_range JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME NOT NULL
);

-- Add indices for performance
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_is_premium ON trips(is_premium);
CREATE INDEX idx_trip_images_order ON trip_images(display_order);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_billing_status ON billing_history(status);
CREATE INDEX idx_statistics_type ON statistics_cache(stat_type);
CREATE INDEX idx_statistics_expiry ON statistics_cache(expires_at);