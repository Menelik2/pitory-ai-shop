-- Add user_name column to product_comments table
ALTER TABLE public.product_comments 
ADD COLUMN user_name TEXT DEFAULT 'Anonymous';