-- ============================================================
-- Pitory AI Shop — FIX: Allow guest checkout (orders RLS)
-- Run this ENTIRE script once in: Supabase → SQL Editor → Run
-- ============================================================

-- 1) Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- 2) Drop ALL existing policies on these tables (avoids name conflicts)
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT policyname, tablename
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('orders', 'order_items')
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- 3) Grants so anon (website visitors) can insert
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

-- 4) Guest checkout: anyone can INSERT orders
CREATE POLICY "orders_insert_public"
ON public.orders
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 5) Guest checkout: anyone can INSERT order_items
CREATE POLICY "order_items_insert_public"
ON public.order_items
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 6) Admins can SELECT all orders
CREATE POLICY "orders_select_admin"
ON public.orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- 7) Admins can UPDATE orders (status)
CREATE POLICY "orders_update_admin"
ON public.orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- 8) Admins can SELECT order_items
CREATE POLICY "order_items_select_admin"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- Done. Try Place Order again on the website.
