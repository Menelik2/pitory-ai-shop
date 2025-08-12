-- 1) Create a private table for any sensitive product contact info
CREATE TABLE IF NOT EXISTS public.product_private_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  vendor_name text,
  supplier_email text,
  supplier_phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_private_info ENABLE ROW LEVEL SECURITY;

-- Admin-only access policies (following existing pattern using admin email)
CREATE POLICY "Admin can view product private info"
ON public.product_private_info
FOR SELECT
USING ((auth.jwt() ->> 'email') = 'linuxos777@gmail.com');

CREATE POLICY "Admin can insert product private info"
ON public.product_private_info
FOR INSERT
WITH CHECK ((auth.jwt() ->> 'email') = 'linuxos777@gmail.com');

CREATE POLICY "Admin can update product private info"
ON public.product_private_info
FOR UPDATE
USING ((auth.jwt() ->> 'email') = 'linuxos777@gmail.com');

CREATE POLICY "Admin can delete product private info"
ON public.product_private_info
FOR DELETE
USING ((auth.jwt() ->> 'email') = 'linuxos777@gmail.com');

-- Keep timestamps updated
CREATE TRIGGER update_product_private_info_updated_at
BEFORE UPDATE ON public.product_private_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Prevent future PII storage in public.products via validation triggers
CREATE OR REPLACE FUNCTION public.enforce_no_pii_in_products()
RETURNS trigger AS $$
DECLARE
  desc_text text;
  specs_text text;
  email_regex text := '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}';
  phone_regex text := '(\+?\d[\d\s\-\(\)]{7,}\d)';
BEGIN
  desc_text := coalesce(NEW.description, '');
  specs_text := coalesce(NEW.detailed_specs::text, '');

  IF desc_text ~* email_regex OR desc_text ~* phone_regex
     OR specs_text ~* email_regex OR specs_text ~* phone_regex THEN
    RAISE EXCEPTION 'PII (email/phone) is not allowed in products.description or products.detailed_specs. Store it in product_private_info instead.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply on insert and update
DROP TRIGGER IF EXISTS trg_products_no_pii_ins ON public.products;
DROP TRIGGER IF EXISTS trg_products_no_pii_upd ON public.products;

CREATE TRIGGER trg_products_no_pii_ins
BEFORE INSERT ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_no_pii_in_products();

CREATE TRIGGER trg_products_no_pii_upd
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.enforce_no_pii_in_products();