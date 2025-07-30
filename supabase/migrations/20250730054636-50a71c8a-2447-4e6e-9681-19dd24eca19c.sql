-- Fix infinite recursion in profiles table RLS policies
-- The issue is that the admin policy tries to query profiles table from within profiles table policy

-- Drop the problematic admin policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simpler admin policy that uses a direct email check instead of querying profiles table
-- This avoids the infinite recursion by not referencing the profiles table within its own policy
CREATE POLICY "Admin can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.jwt() ->> 'email' = 'linuxos777@gmail.com'
  OR auth.uid() = id
);

-- Also update the products admin policy to use the same approach to avoid recursion
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Create a new admin policy for products that doesn't cause recursion
CREATE POLICY "Admin can manage products" 
ON public.products 
FOR ALL 
USING (auth.jwt() ->> 'email' = 'linuxos777@gmail.com');

-- Update order policies to use the same approach
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;

CREATE POLICY "Admin can view all orders" 
ON public.orders 
FOR SELECT 
USING (
  auth.jwt() ->> 'email' = 'linuxos777@gmail.com'
  OR auth.uid() = user_id
);

CREATE POLICY "Admin can update orders" 
ON public.orders 
FOR UPDATE 
USING (auth.jwt() ->> 'email' = 'linuxos777@gmail.com');

-- Update order_items policies
DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;

CREATE POLICY "Admin can view all order items" 
ON public.order_items 
FOR SELECT 
USING (
  auth.jwt() ->> 'email' = 'linuxos777@gmail.com'
  OR EXISTS ( SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);