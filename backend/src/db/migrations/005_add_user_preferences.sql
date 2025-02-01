-- Create new table with additional columns
CREATE TABLE users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  experience_level TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  preferred_routes TEXT,
  motorcycle_details TEXT
);

-- Copy data from old table to new table
INSERT INTO users_new (id, email, password, username, avatar, role, experience_level, created_at)
SELECT id, email, password, username, avatar, role, experience_level, created_at FROM users;

-- Drop old table
DROP TABLE users;

-- Rename new table to original name
ALTER TABLE users_new RENAME TO users;

-- Create indices for performance
CREATE INDEX idx_users_preferred_routes ON users(preferred_routes);
CREATE INDEX idx_users_motorcycle_details ON users(motorcycle_details);