CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  featured_image TEXT NOT NULL DEFAULT '',
  published INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_published_created
  ON blog_posts (published, created_at DESC);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_faqs_order ON faqs (order_index, created_at);

CREATE TABLE IF NOT EXISTS admin_login_attempts (
  client_key TEXT PRIMARY KEY,
  attempt_count INTEGER NOT NULL,
  reset_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created
  ON admin_audit_logs (created_at DESC);

INSERT OR IGNORE INTO faqs (id, question, answer, order_index, created_at, updated_at) VALUES
  ('default-1', 'How long does a full detail take?', 'A full interior and exterior detail typically takes 4 to 6 hours depending on the vehicle size and condition.', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('default-2', 'Do you need access to water and power?', 'No. The mobile detailing setup is self-contained with water and power for suitable mobile appointments.', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('default-3', 'What is a ceramic coating?', 'A ceramic coating bonds to prepared paint to add gloss, water beading, UV resistance, and easier maintenance than traditional wax.', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('default-4', 'Do I need to be present while you detail my car?', 'Not for the entire appointment. Bryan needs access to the vehicle and will confirm the handoff and completion details with you.', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
