CREATE TABLE users_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar TEXT,
  role TEXT DEFAULT 'user',
  experience_level TEXT,
  preferred_routes TEXT,
  motorcycle_details TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users_new SELECT * FROM users;
DROP TABLE users;
ALTER TABLE users_new RENAME TO users;

CREATE INDEX idx_users_preferred_routes ON users(preferred_routes);
CREATE INDEX idx_users_motorcycle_details ON users(motorcycle_details);
CREATE INDEX idx_users_bio ON users(bio);