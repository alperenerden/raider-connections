import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSwipes = () => {
  const { toast } = useToast();

  const swipe = async (swiperId: string, swipedId: string, isLike: boolean) => {
    try {
      const { error } = await supabase
        .from('swipes')
        .insert({
          swiper_id: swiperId,
          swiped_id: swipedId,
          is_like: isLike,
        });

      if (error) throw error;

      // Check if this creates a match
      if (isLike) {
        const { data: reciprocalSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', swipedId)
          .eq('swiped_id', swiperId)
          .eq('is_like', true)
          .single();

        if (reciprocalSwipe) {
          toast({
            title: "It's a Match! 🎉",
            description: "You can now start chatting!",
          });
          return true; // It's a match
        }
      }

      return false; // Not a match
    } catch (error: any) {
      // Only log detailed errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error('Error swiping:', error);
      }
      toast({
        title: "Error",
        description: "Unable to process swipe. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { swipe };
};
