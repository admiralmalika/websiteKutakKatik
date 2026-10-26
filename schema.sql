-- ============================================================================
-- NIGHTWORKS® · KUTAK KATIK STUDIO — POSTGRESQL DATABASE SCHEMA
-- Connect using DATABASE_URL (e.g., postgresql://postgres:password@localhost:5432/kutakkatik)
-- Note: server.js / db.js automatically creates and migrates these tables on startup!
-- ============================================================================

CREATE TABLE IF NOT EXISTS store_kv (
  key VARCHAR(100) PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category VARCHAR(120) NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(12, 2),
  stock INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  featured_slot INTEGER,
  badge VARCHAR(100),
  rating NUMERIC(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  finishes JSONB DEFAULT '[]'::jsonb,
  dimensions TEXT,
  lead_time TEXT,
  image TEXT,
  hover_image TEXT,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(120),
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'customer',
  company VARCHAR(255),
  joined_at VARCHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id VARCHAR(100) PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(100),
  shipping_address TEXT NOT NULL,
  shipping_method VARCHAR(255),
  payment_method VARCHAR(255),
  status VARCHAR(60) NOT NULL DEFAULT 'Pending',
  payment_status VARCHAR(60) NOT NULL DEFAULT 'Unpaid',
  payment_proof_url TEXT,
  payment_sender_name VARCHAR(255),
  payment_sender_bank VARCHAR(120),
  payment_notes TEXT,
  payment_uploaded_at TIMESTAMPTZ,
  payment_verified_at TIMESTAMPTZ,
  payment_verified_by VARCHAR(255),
  voucher_code VARCHAR(100),
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0,
  discount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS vouchers (
  code VARCHAR(100) PRIMARY KEY,
  discount_percent NUMERIC(5, 2) NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
