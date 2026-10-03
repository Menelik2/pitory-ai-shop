-- ============================================================
-- Admin can DELETE customer product comments
-- Run in Supabase → SQL Editor → Run
-- ============================================================

ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON public.product_comments TO anon, authenticated;
GRANT DELETE ON public.product_comments TO authenticated;

DROP POLICY IF EXISTS "Anyone can view comments" ON public.product_comments;
CREATE POLICY "Anyone can view comments"
ON public.product_comments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Anyone can insert comments" ON public.product_comments;
CREATE POLICY "Anyone can insert comments"
ON public.product_comments FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete comments" ON public.product_comments;
CREATE POLICY "Admins can delete comments"
ON public.product_comments
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
  OR (auth.jwt() ->> 'email') = 'linuxos777@gmail.com'
);
