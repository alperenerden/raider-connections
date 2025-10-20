-- Fix critical security issues before launch

-- 1. Fix profiles table RLS - only show profiles in valid contexts
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Users can view profiles they haven't swiped yet (for discovery)
CREATE POLICY "Users can view unswipeable profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    id NOT IN (
      SELECT swiped_id FROM public.swipes 
      WHERE swiper_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view profiles they've matched with
CREATE POLICY "Users can view matched profiles"
  ON public.profiles FOR SELECT
  USING (
    id IN (
      SELECT user1_id FROM public.matches 
      WHERE user2_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    ) OR
    id IN (
      SELECT user2_id FROM public.matches 
      WHERE user1_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- 2. Fix user_badges table RLS - restrict to owner and matches only
DROP POLICY IF EXISTS "Users can view other users badges" ON public.user_badges;

-- Users can only view badges of people they've matched with
CREATE POLICY "Users can view matched users badges"
  ON public.user_badges FOR SELECT
  USING (
    user_id IN (
      SELECT user1_id FROM public.matches 
      WHERE user2_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      UNION
      SELECT user2_id FROM public.matches 
      WHERE user1_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      UNION
      SELECT id FROM public.profiles WHERE user_id = auth.uid()
    )
  );