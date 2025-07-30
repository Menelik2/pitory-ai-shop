-- Fix products table RLS policies to allow admin to insert, update, and delete products
-- Drop the current admin policy and recreate with proper permissions

DROP POLICY IF EXISTS "Admin can manage products" ON public.products;

-- Create separate policies for each operation to ensure admins can do everything
CREATE POLICY "Admin can view products" 
ON public.products 
FOR SELECT 
USING (true);  -- Anyone can view products

CREATE POLICY "Admin can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.jwt() ->> 'email' = 'linuxos777@gmail.com');

CREATE POLICY "Admin can update products" 
ON public.products 
FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'linuxos777@gmail.com');

CREATE POLICY "Admin can delete products" 
ON public.products 
FOR DELETE 
USING (auth.jwt() ->> 'email' = 'linuxos777@gmail.com');