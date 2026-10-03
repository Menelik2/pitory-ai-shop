-- ============================================================
-- Allow ADMINS to fully DELETE orders + order_items
-- Run in Supabase → SQL Editor → Run
-- ============================================================

-- Grants
GRANT DELETE ON public.orders TO authenticated;
GRANT DELETE ON public.order_items TO authenticated;

-- Drop old delete policies if any
DROP POLICY IF EXISTS "orders_delete_admin" ON public.orders;
DROP POLICY IF EXISTS "order_items_delete_admin" ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;

-- Admin can delete orders
CREATE POLICY "orders_delete_admin"
ON public.orders
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- Admin can delete order_items
CREATE POLICY "order_items_delete_admin"
ON public.order_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);

-- Optional: when an order is deleted, cascade items (if FK allows)
-- Uncomment if you want DB-level cascade:
-- ALTER TABLE public.order_items
--   DROP CONSTRAINT IF EXISTS order_items_order_id_fkey,
--   ADD CONSTRAINT order_items_order_id_fkey
--     FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;
