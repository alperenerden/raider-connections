import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  age: number | null;
  bio: string | null;
  profile_image_url: string | null;
  location: string | null;
  interests: string[] | null;
}

export const useProfiles = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current user's profile id
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!currentProfile) return;
      
      setCurrentUserId(currentProfile.id);

      // Get profiles that the user hasn't swiped on yet
      const { data: swipedIds } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', currentProfile.id);

      const swipedProfileIds = swipedIds?.map(s => s.swiped_id) || [];

      // Fetch profiles excluding already swiped and current user
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', currentProfile.id)
        .not('id', 'in', `(${swipedProfileIds.join(',') || 'null'})`)
        .limit(20);

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeProfile = (profileId: string) => {
    setProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  return { profiles, loading, currentUserId, removeProfile, refetch: fetchProfiles };
};
