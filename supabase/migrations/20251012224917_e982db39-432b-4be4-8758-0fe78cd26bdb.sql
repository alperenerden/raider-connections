-- Add restrictive RLS policies for user_badges table
-- Prevent client-side badge manipulation

CREATE POLICY "Badges can only be created by system"
  ON public.user_badges FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No manual badge updates"
  ON public.user_badges FOR UPDATE
  USING (false);

CREATE POLICY "No manual badge deletion"
  ON public.user_badges FOR DELETE
  USING (false);

-- Create a SECURITY DEFINER function to award badges from triggers/functions
CREATE OR REPLACE FUNCTION public.award_badge(
  _user_id UUID,
  _badge_name TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert badge, ignore if already exists
  INSERT INTO public.user_badges (user_id, badge_name)
  VALUES (_user_id, _badge_name)
  ON CONFLICT (user_id, badge_name) DO NOTHING;
END;
$$;