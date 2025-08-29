import { useState, useEffect } from "react";
import { MatchBadge } from "@/components/BadgeSystem";

// Import badge icons
import firstSparkIcon from "@/assets/badges/first-spark.png";
import heatWaveIcon from "@/assets/badges/heat-wave.png";
import classicCharmIcon from "@/assets/badges/classic-charm.png";
import rareFindIcon from "@/assets/badges/rare-find.png";
import stickySituationIcon from "@/assets/badges/sticky-situation.png";
import foreverFriendIcon from "@/assets/badges/forever-friend.png";
import legendStatusIcon from "@/assets/badges/legend-status.png";

const initialBadges: MatchBadge[] = [
  {
    id: "first-spark",
    name: "First Spark",
    description: "Your first connection! Welcome to the club.",
    requiredMatches: 50,
    tier: "bronze",
    unlocked: false,
    displayOnProfile: false,
    icon: firstSparkIcon
  },
  {
    id: "heat-wave", 
    name: "Heat Wave",
    description: "Getting warmed up! Keep swiping.",
    requiredMatches: 100,
    tier: "silver",
    unlocked: false,
    displayOnProfile: false,
    icon: heatWaveIcon
  },
  {
    id: "classic-charm",
    name: "Classic Charm",
    description: "Timeless appeal unlocked!",
    requiredMatches: 150,
    tier: "gold",
    unlocked: false,
    displayOnProfile: false,
    icon: classicCharmIcon
  },
  {
    id: "rare-find",
    name: "Rare Find", 
    description: "Uncommon but special, just like you!",
    requiredMatches: 200,
    tier: "platinum",
    unlocked: false,
    displayOnProfile: false,
    icon: rareFindIcon
  },
  {
    id: "sticky-situation",
    name: "Sticky Situation",
    description: "Making lasting connections!",
    requiredMatches: 250,
    tier: "diamond", 
    unlocked: false,
    displayOnProfile: false,
    icon: stickySituationIcon
  },
  {
    id: "forever-friend",
    name: "Forever Friend",
    description: "The bond that keeps on bonding!",
    requiredMatches: 300,
    tier: "legendary",
    unlocked: false,
    displayOnProfile: false,
    icon: foreverFriendIcon
  },
  {
    id: "legend-status",
    name: "Legend Status",
    description: "Ultimate achievement - you're legendary!",
    requiredMatches: 350,
    tier: "mythic",
    unlocked: false,
    displayOnProfile: false,
    icon: legendStatusIcon
  }
];

export const useBadges = (currentMatches: number) => {
  const [badges, setBadges] = useState<MatchBadge[]>(initialBadges);

  useEffect(() => {
    setBadges(prevBadges => 
      prevBadges.map(badge => ({
        ...badge,
        unlocked: currentMatches >= badge.requiredMatches
      }))
    );
  }, [currentMatches]);

  const toggleBadgeDisplay = (badgeId: string) => {
    setBadges(prevBadges =>
      prevBadges.map(badge =>
        badge.id === badgeId 
          ? { ...badge, displayOnProfile: !badge.displayOnProfile }
          : badge
      )
    );
  };

  const getDisplayedBadges = () => {
    return badges.filter(badge => badge.unlocked && badge.displayOnProfile);
  };

  return {
    badges,
    toggleBadgeDisplay,
    getDisplayedBadges
  };
};