CREATE TABLE review_images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  FOREIGN KEY (review_id) REFERENCES reviews(id)
);
