// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ivzoqlyeyqnpubfrglsr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2em9xbHlleXFucHViZnJnbHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MjY1ODMsImV4cCI6MjA2ODQwMjU4M30.3YrrhftIj71e-vIfRJQldj61TbMTKth4NB3beoJBTwk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});