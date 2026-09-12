-- ========================================================
-- MEX TANIM STORE — SUPABASE DATABASE SCHEMA & INITIAL SEED DATA
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
  specs TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
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

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id VARCHAR PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  address TEXT NOT NULL,
  delivery_area VARCHAR,
  delivery_charge NUMERIC DEFAULT 70,
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  payment_method VARCHAR DEFAULT 'Cash on Delivery',
  payment_status VARCHAR DEFAULT 'Unpaid',
  status VARCHAR DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id VARCHAR PRIMARY KEY,
  customer_name VARCHAR NOT NULL,
  phone VARCHAR,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow Public Read/Write for Store operations
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Public Access Policies
CREATE POLICY "Public Read Access Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Write Access Products" ON public.products FOR ALL USING (true);

CREATE POLICY "Public Read Access Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Write Access Categories" ON public.categories FOR ALL USING (true);

CREATE POLICY "Public Read Access Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Write Access Orders" ON public.orders FOR ALL USING (true);

CREATE POLICY "Public Read Access Messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Public Write Access Messages" ON public.messages FOR ALL USING (true);

-- ========================================================
-- INITIAL SEED DATA
-- ========================================================

-- Categories Seed
INSERT INTO public.categories (id, name, slug, description, image_url, product_count)
VALUES
  ('cat-mice', 'GAMING MICE', 'gaming-mice', 'High precision esports RGB gaming mice.', '/categories/gaming-mice.svg', 18),
  ('cat-keyboards', 'MECHANICAL KEYBOARDS', 'mechanical-keyboards', 'Mechanical gaming keyboards with customizable switches.', '/categories/mechanical-keyboards.svg', 15),
  ('cat-headphones', 'GAMING HEADSETS', 'gaming-headsets', 'Surround sound over-ear gaming headsets.', '/categories/gaming-headsets.svg', 24),
  ('cat-chargers', 'FAST CHARGERS', 'fast-chargers', 'GaN fast wall charger adapters.', '/categories/fast-chargers.svg', 32),
  ('cat-sleeves', 'FINGER SLEEVES', 'finger-sleeves', 'Sweatproof gaming finger sleeves.', '/categories/finger-sleeves.svg', 12),
  ('cat-cables', 'CABLES', 'cables', 'Heavy-duty braided charging cables.', '/categories/cables.svg', 40),
  ('cat-soundboxes', 'SOUNDBOXES', 'soundboxes', 'Portable Bluetooth soundbox speakers.', '/categories/soundboxes.svg', 16),
  ('cat-trimmers', 'TRIMMERS', 'trimmers', 'Modern electric hair and beard trimmers.', '/categories/trimmers.svg', 10)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url;

-- Products Seed
INSERT INTO public.products (id, title, title_bn, brand, category, price, original_price, discount, stock, description, description_bn, specs, image_url)
VALUES
  (
    'prod-cooler-1',
    'MEMO CX08 PRO PHONE COOLER',
    'মেমো CX08 প্রো ফোন কুলার',
    'MEMO',
    'gaming-cooler',
    1400,
    1600,
    12,
    25,
    'Semiconductor magnetic RGB cooling fan for PUBG & Mobile Gaming.',
    'পাবজি ও মোবাইল গেমিংয়ের জন্য আরজিবি কুলিং ফ্যান।',
    'Semiconductor Cooling, Magnetic Attachment, RGB Light Effects',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=600&q=80'
  ),
  (
    'prod-headset-1',
    'JBL Quantum 100 Gaming Headset',
    'জেবিএল কোয়ান্টাম ১০০ গেমিং হেডসেট',
    'JBL',
    'gaming-headsets',
    3950,
    4800,
    18,
    15,
    'Wired over-ear gaming headset with detachable mic.',
    'ডিটেচেবল মাইক্রোফোন সহ প্রিমিয়াম গেমিং হেডসেট।',
    '40mm Drivers, Memory Foam, Detachable Mic',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80'
  )
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, price = EXCLUDED.price;
