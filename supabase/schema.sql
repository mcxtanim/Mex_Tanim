-- ========================================================
-- MEX TANIM STORE — SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Project Reference: mbchiojrtufgmchyuxpp
-- ========================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id VARCHAR PRIMARY KEY,
  title VARCHAR NOT NULL,
  title_bn VARCHAR,
  brand VARCHAR,
  category VARCHAR NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  discount INT DEFAULT 0,
  stock INT DEFAULT 10,
  description TEXT,
  description_bn TEXT,
  specs TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  is_popular BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  is_combo BOOLEAN DEFAULT FALSE
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id VARCHAR PRIMARY KEY,
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  product_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FOREIGN KEY CONSTRAINT & INDEXES
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);

ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS fk_products_category;

ALTER TABLE public.products
  ADD CONSTRAINT fk_products_category
  FOREIGN KEY (category) REFERENCES public.categories(slug)
  ON UPDATE CASCADE ON DELETE SET NULL;

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR PRIMARY KEY,
  order_number VARCHAR,
  customer_name VARCHAR NOT NULL,
  customer_email VARCHAR,
  phone VARCHAR NOT NULL,
  address TEXT NOT NULL,
  shipping_address JSONB,
  delivery_area VARCHAR,
  delivery_charge NUMERIC DEFAULT 70,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method VARCHAR DEFAULT 'Cash on Delivery',
  payment_status VARCHAR DEFAULT 'Unpaid',
  status VARCHAR DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAVED ADDRESSES TABLE (For "save address for next order" feature)
CREATE TABLE IF NOT EXISTS public.saved_addresses (
  id VARCHAR PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  division VARCHAR,
  district VARCHAR,
  upazila VARCHAR,
  area TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_addresses ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Products Policies (Public SELECT allowed; Public INSERT/UPDATE/DELETE blocked)
DROP POLICY IF EXISTS "Public Write Access Products" ON public.products;
CREATE POLICY "Public Read Access Products" ON public.products FOR SELECT USING (true);

-- Categories Policies (Public SELECT allowed; Public INSERT/UPDATE/DELETE blocked)
DROP POLICY IF EXISTS "Public Write Access Categories" ON public.categories;
CREATE POLICY "Public Read Access Categories" ON public.categories FOR SELECT USING (true);

-- Orders Policies (Public INSERT allowed for order placement; Public SELECT/UPDATE/DELETE blocked)
DROP POLICY IF EXISTS "Public Write Access Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Access Orders" ON public.orders;
CREATE POLICY "Public Insert Access Orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Saved Addresses Policies (Public INSERT allowed for saving address; Public SELECT/UPDATE/DELETE blocked)
DROP POLICY IF EXISTS "Public Read Access Saved Addresses" ON public.saved_addresses;
CREATE POLICY "Public Insert Access Saved Addresses" ON public.saved_addresses FOR INSERT WITH CHECK (true);
