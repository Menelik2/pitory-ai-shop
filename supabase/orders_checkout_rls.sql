-- ============================================================
-- Pitory AI Shop — Full orders RLS (insert + admin read/update/delete)
-- Run this ENTIRE script once in: Supabase → SQL Editor → Run
-- ============================================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on these tables
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

-- Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT INSERT ON public.orders TO anon, authenticated;
GRANT INSERT ON public.order_items TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, DELETE ON public.order_items TO authenticated;

-- Guest checkout INSERT
CREATE POLICY "orders_insert_public"
ON public.orders FOR INSERT TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "order_items_insert_public"
ON public.order_items FOR INSERT TO anon, authenticated
WITH CHECK (true);

-- Admin SELECT
CREATE POLICY "orders_select_admin"
ON public.orders FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

CREATE POLICY "order_items_select_admin"
ON public.order_items FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- Admin UPDATE
CREATE POLICY "orders_update_admin"
ON public.orders FOR UPDATE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- Admin DELETE (full remove from database)
CREATE POLICY "orders_delete_admin"
ON public.orders FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

CREATE POLICY "order_items_delete_admin"
ON public.order_items FOR DELETE TO authenticated
USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);
