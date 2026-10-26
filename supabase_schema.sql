-- ================================================================
-- PANTALOONS VR AMBARSAR STORE DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    delivery_type TEXT NOT NULL DEFAULT 'delivery',
    address TEXT,
    city TEXT,
    pincode TEXT,
    pickup_slot TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    delivery_charge NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Pending',
    payment_method TEXT NOT NULL DEFAULT 'Cash on Delivery',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    date TEXT,
    location TEXT DEFAULT 'VR Ambarsar Shopper',
    content TEXT NOT NULL,
    verified BOOLEAN DEFAULT true,
    badge TEXT,
    status TEXT NOT NULL DEFAULT 'approved',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. BOOKINGS TABLE (VIP Store Consultations)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    category TEXT NOT NULL,
    preferred_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SITE SETTINGS TABLE (Maintenance Mode / Superadmin Control)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'global',
    is_site_online BOOLEAN NOT NULL DEFAULT true,
    maintenance_message TEXT DEFAULT 'The store website is currently undergoing scheduled inventory updates.',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Insert initial global site settings row if not exists
INSERT INTO public.site_settings (id, is_site_online, maintenance_message)
VALUES ('global', true, 'The store website is currently undergoing scheduled inventory updates.')
ON CONFLICT (id) DO NOTHING;

-- 5. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 6. PUBLIC ACCESS POLICIES (Allow customers & admins to read & write)
-- Orders
DROP POLICY IF EXISTS "Public full access to orders" ON public.orders;
CREATE POLICY "Public full access to orders" ON public.orders
    FOR ALL USING (true) WITH CHECK (true);

-- Reviews
DROP POLICY IF EXISTS "Public full access to reviews" ON public.reviews;
CREATE POLICY "Public full access to reviews" ON public.reviews
    FOR ALL USING (true) WITH CHECK (true);

-- Bookings
DROP POLICY IF EXISTS "Public full access to bookings" ON public.bookings;
CREATE POLICY "Public full access to bookings" ON public.bookings
    FOR ALL USING (true) WITH CHECK (true);

-- Site Settings
DROP POLICY IF EXISTS "Public full access to site_settings" ON public.site_settings;
CREATE POLICY "Public full access to site_settings" ON public.site_settings
    FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- INITIAL SEED REVIEWS
-- ================================================================
INSERT INTO public.reviews (id, author, rating, date, location, content, verified, badge, status)
VALUES
('rev-1', 'Simranjeet Kaur', 5, '2 days ago', 'Amritsar Mall Shopper', 'Loved the festive ethnic collection at the VR Ambarsar store! The staff was courteous and helped me find the perfect matching jewelry for my cousin''s wedding.', true, 'Festive Buyer', 'approved'),
('rev-2', 'Manpreet Singh', 5, '1 week ago', 'Circular Road, Amritsar', 'Great denim collection and fitting room experience. The store is well organized on the Lower Ground floor.', true, 'Verified Customer', 'approved'),
('rev-3', 'Gurleen Pannu', 5, '2 weeks ago', 'Ranjit Avenue, Amritsar', 'Booked a store stylist consultation beforehand and it saved so much time! The trial was smooth and billing was super fast.', true, 'VIP Shopper', 'approved')
ON CONFLICT (id) DO NOTHING;
