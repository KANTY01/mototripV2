ALTER TABLE users ADD bio TEXT;
CREATE INDEX idx_users_bio ON users(bio);