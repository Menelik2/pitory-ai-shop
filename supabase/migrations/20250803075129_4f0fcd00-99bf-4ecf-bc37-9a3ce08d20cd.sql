-- Create product_comments table
CREATE TABLE public.product_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view comments" 
ON public.product_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert comments" 
ON public.product_comments 
FOR INSERT 
WITH CHECK (true);