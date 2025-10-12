-- Fix critical security issues before launch

-- 1. Require authentication to view profiles (prevent scraping)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

CREATE POLICY "Authenticated users can view profiles"
  ON public.profiles FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- 2. Prevent direct match creation (matches should only be created via trigger)
CREATE POLICY "Matches can only be created by trigger"
  ON public.matches FOR INSERT
  WITH CHECK (false);

-- 3. Add input validation constraints on profiles
ALTER TABLE public.profiles
ADD CONSTRAINT display_name_length CHECK (char_length(display_name) BETWEEN 1 AND 50),
ADD CONSTRAINT bio_length CHECK (bio IS NULL OR char_length(bio) <= 500),
ADD CONSTRAINT location_length CHECK (location IS NULL OR char_length(location) <= 100),
ADD CONSTRAINT age_range CHECK (age IS NULL OR (age >= 18 AND age <= 120));

-- 4. Add input validation constraints on messages
ALTER TABLE public.messages
ADD CONSTRAINT message_content_length CHECK (char_length(content) BETWEEN 1 AND 5000);