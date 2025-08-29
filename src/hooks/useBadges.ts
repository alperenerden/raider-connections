import { useState, useEffect } from "react";
import { STDBadge } from "@/components/BadgeSystem";

// Import badge icons
import chlamydiaIcon from "@/assets/badges/chlamydia.png";
import gonorrheaIcon from "@/assets/badges/gonorrhea.png";
import syphilisIcon from "@/assets/badges/syphilis.png";
import trichomoniasisIcon from "@/assets/badges/trichomoniasis.png";
import crabsIcon from "@/assets/badges/crabs.png";
import herpesIcon from "@/assets/badges/herpes.png";
import aidsIcon from "@/assets/badges/aids.png";

const initialBadges: STDBadge[] = [
  {
    id: "chlamydia",
    name: "Chlamydia",
    description: "Your first infection! Welcome to the club.",
    requiredMatches: 50,
    tier: "bronze",
    unlocked: false,
    displayOnProfile: false,
    icon: chlamydiaIcon
  },
  {
    id: "gonorrhea", 
    name: "Gonorrhea",
    description: "Getting warmed up! Keep swiping.",
    requiredMatches: 100,
    tier: "silver",
    unlocked: false,
    displayOnProfile: false,
    icon: gonorrheaIcon
  },
  {
    id: "syphilis",
    name: "Syphilis",
    description: "Historical achievement unlocked!",
    requiredMatches: 150,
    tier: "gold",
    unlocked: false,
    displayOnProfile: false,
    icon: syphilisIcon
  },
  {
    id: "trichomoniasis",
    name: "Trichomoniasis", 
    description: "Rare but persistent, just like you!",
    requiredMatches: 200,
    tier: "platinum",
    unlocked: false,
    displayOnProfile: false,
    icon: trichomoniasisIcon
  },
  {
    id: "crabs",
    name: "Crabs",
    description: "Clingy companions for life!",
    requiredMatches: 250,
    tier: "diamond", 
    unlocked: false,
    displayOnProfile: false,
    icon: crabsIcon
  },
  {
    id: "herpes",
    name: "Herpes",
    description: "The gift that keeps on giving!",
    requiredMatches: 300,
    tier: "legendary",
    unlocked: false,
    displayOnProfile: false,
    icon: herpesIcon
  },
  {
    id: "aids",
    name: "AIDS",
    description: "Ultimate achievement - you're legendary!",
    requiredMatches: 350,
    tier: "mythic",
    unlocked: false,
    displayOnProfile: false,
    icon: aidsIcon
  }
];

export const useBadges = (currentMatches: number) => {
  const [badges, setBadges] = useState<STDBadge[]>(initialBadges);

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