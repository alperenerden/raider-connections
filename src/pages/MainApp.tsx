import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import SwipeCard from "@/components/SwipeCard";
import BadgeSystem from "@/components/BadgeSystem";
import { useBadges } from "@/hooks/useBadges";
import { useProfiles } from "@/hooks/useProfiles";
import { useSwipes } from "@/hooks/useSwipes";
import { useMatches } from "@/hooks/useMatches";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import RaiderRashLogo from "@/components/RaiderRashLogo";
import { Heart, MessageCircle, MapPin, Settings, User, Filter, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MainApp = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [user, setUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profiles, loading: profilesLoading, currentUserId, removeProfile } = useProfiles();
  const { swipe } = useSwipes();
  const { matches, loading: matchesLoading } = useMatches();
  const { badges, toggleBadgeDisplay, getDisplayedBadges } = useBadges(matches.length);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSwipe = async (direction: "left" | "right") => {
    if (!currentUserId || !profiles[currentProfileIndex]) return;

    const currentProfile = profiles[currentProfileIndex];
    const isLike = direction === "right";

    // Save swipe to database
    await swipe(currentUserId, currentProfile.id, isLike);

    // Remove profile from list
    removeProfile(currentProfile.id);
    
    // Move to next profile (index stays same since we removed current)
    if (currentProfileIndex >= profiles.length - 1) {
      setCurrentProfileIndex(0);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
    navigate("/landing");
  };

  const renderDiscoverTab = () => (
    <div className="flex flex-col min-h-screen overflow-y-auto pb-20">
      <div className="flex items-center justify-between w-full p-4">
        <RaiderRashLogo size="sm" />
        <h2 className="text-xl font-bold">Discover</h2>
        <Button variant="ghost" size="icon">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        {profilesLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profiles...</p>
          </div>
        ) : profiles[currentProfileIndex] ? (
          <SwipeCard 
            profile={{
              id: profiles[currentProfileIndex].id,
              name: profiles[currentProfileIndex].display_name,
              age: profiles[currentProfileIndex].age || 0,
              major: "Red Raider",
              year: "Student",
              bio: profiles[currentProfileIndex].bio || "Hey there! 👋",
              interests: profiles[currentProfileIndex].interests || [],
              images: [profiles[currentProfileIndex].profile_image_url || "https://picsum.photos/400/600?random=1"],
              distance: "Campus",
            }}
            onSwipe={handleSwipe}
          />
        ) : (
          <div className="text-center space-y-4">
            <div className="text-6xl">🎉</div>
            <h3 className="text-xl font-semibold">That's everyone for now!</h3>
            <p className="text-muted-foreground">Check back later for more Raiders</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderMatchesTab = () => (
    <div className="min-h-screen overflow-y-auto pb-20">
      <div className="flex items-center justify-between p-4 mb-6">
        <h2 className="text-2xl font-bold">Your Matches</h2>
        <Badge variant="secondary">{matches.length}</Badge>
      </div>
      
      <div className="space-y-4 px-4">
        {matchesLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <div className="text-4xl">💔</div>
            <h3 className="font-semibold">No matches yet</h3>
            <p className="text-sm text-muted-foreground">Start swiping to find your matches!</p>
          </div>
        ) : (
          matches.map((match) => (
            <Button
              key={match.id} 
              variant="ghost"
              className="w-full h-auto p-4 justify-start hover:bg-muted/50"
              onClick={() => {
                setActiveTab("chat");
              }}
            >
              <div className="flex items-center gap-4 w-full">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={match.matchedProfile.profile_image_url || undefined} />
                  <AvatarFallback className="text-lg">
                    {match.matchedProfile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">{match.matchedProfile.display_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {match.matchedProfile.age && `${match.matchedProfile.age} • `}
                    Start a conversation!
                  </p>
                </div>
                <MessageCircle className="w-5 h-5 text-muted-foreground" />
              </div>
            </Button>
          ))
        )}
      </div>
    </div>
  );

  const renderHotspotsTab = () => (
    <div className="min-h-screen overflow-y-auto pb-20">
      <div className="flex items-center justify-between p-4 mb-6">
        <h2 className="text-2xl font-bold">Campus Hotspots</h2>
        <MapPin className="w-6 h-6 text-primary" />
      </div>
      
      <div className="space-y-4 px-4">
        {mockHotspots.map((spot) => (
          <div key={spot.id} className="gradient-card p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{spot.name}</h3>
              <Badge variant="secondary">{spot.activeUsers} active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{spot.description}</p>
            <Button variant="outline" size="sm" className="w-full">
              Check In Here
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBadgesTab = () => (
    <BadgeSystem 
      badges={badges}
      currentMatches={matches.length}
      onToggleDisplay={toggleBadgeDisplay}
    />
  );

  const renderProfileTab = () => {
    const userData = {
      name: "Alex Rodriguez",
      age: 20,
      major: "Computer Science", 
      year: "Senior",
    };

    return (
      <div className="min-h-screen overflow-y-auto pb-20 bg-background">
        <div className="flex flex-col items-center p-6 space-y-6">
          {/* Large Profile Photo */}
          <div className="mt-8">
            <Avatar className="w-40 h-40 border-4 border-border shadow-lg">
              <AvatarImage src="/placeholder.svg" alt="Your profile" />
              <AvatarFallback className="text-4xl font-bold bg-primary text-primary-foreground">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Name and Age */}
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{userData.name}, {userData.age}</h1>
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xs">✓</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 w-full max-w-md justify-center">
            <Button
              variant="ghost"
              size="lg"
              className="flex flex-col gap-2 h-auto py-4"
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings page coming soon!",
                });
              }}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <Settings className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground uppercase">Settings</span>
            </Button>

            <Button
              variant="default"
              size="lg"
              className="flex flex-col gap-2 h-auto py-4 bg-primary hover:bg-primary/90"
              onClick={() => {
                toast({
                  title: "Add Media",
                  description: "Photo upload coming soon!",
                });
              }}
            >
              <div className="w-16 h-16 rounded-full bg-primary shadow-lg flex items-center justify-center relative">
                <Heart className="w-7 h-7 text-white fill-white" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">+</span>
                </div>
              </div>
              <span className="text-xs text-white uppercase font-semibold">Add Media</span>
            </Button>

            <Button
              variant="ghost"
              size="lg"
              className="flex flex-col gap-2 h-auto py-4"
              onClick={() => {
                toast({
                  title: "Edit Profile",
                  description: "Profile editing coming soon!",
                });
              }}
            >
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground uppercase">Edit Info</span>
            </Button>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>

          {/* Photo Tip Banner */}
          <div className="w-full max-w-md">
            <div className="gradient-primary rounded-2xl p-4 flex items-center justify-between shadow-md">
              <p className="text-white font-medium">
                Photo Tip: A smile should get their attention
              </p>
              <Button
                size="icon"
                variant="ghost"
                className="bg-white/20 hover:bg-white/30 text-white rounded-full"
              >
                <span className="text-xl">+</span>
              </Button>
            </div>
          </div>

          {/* Display selected badges */}
          {getDisplayedBadges().length > 0 && (
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-lg">My Infections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {getDisplayedBadges().map(badge => (
                    <div key={badge.id} className="flex items-center gap-2 bg-primary/10 rounded-full px-3 py-1">
                      <img 
                        src={badge.icon} 
                        alt={badge.name}
                        className="w-4 h-4 object-contain"
                      />
                      <span className="text-sm font-medium text-primary">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Get Premium Section */}
          <Card className="w-full max-w-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🔥</div>
              <h3 className="text-xl font-bold">Get Raider Rash Premium</h3>
              <p className="text-muted-foreground">See who Likes You & more!</p>
              <Button className="w-full" size="lg">
                GET PREMIUM
              </Button>
            </CardContent>
          </Card>

          {/* Profile Stats */}
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="flex justify-around">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{matches.length}</p>
                  <p className="text-sm text-muted-foreground">Matches</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{userData.age}</p>
                  <p className="text-sm text-muted-foreground">Age</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{getDisplayedBadges().length}</p>
                  <p className="text-sm text-muted-foreground">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const mockHotspots = [
    { id: "1", name: "Student Union Building", description: "Great place to meet between classes", activeUsers: 23 },
    { id: "2", name: "Rec Center", description: "Work out and meet fitness enthusiasts", activeUsers: 15 },
    { id: "3", name: "Library Study Rooms", description: "Find study partners for your major", activeUsers: 8 },
    { id: "4", name: "Jones AT&T Stadium", description: "Game day connections!", activeUsers: 156 },
  ];

  const renderChatTab = () => (
    <div className="min-h-screen overflow-y-auto pb-20">
      <div className="flex items-center justify-between p-4 mb-6 border-b">
        <Button 
          variant="ghost" 
          onClick={() => setActiveTab("matches")}
          className="text-primary"
        >
          ← Back to Matches
        </Button>
        <h2 className="text-xl font-bold">Chat</h2>
        <div></div>
      </div>
      
      <div className="space-y-4 px-4">
        <div className="bg-muted/50 rounded-lg p-4 max-w-xs">
          <p className="text-sm">Hey! How's your semester going?</p>
          <p className="text-xs text-muted-foreground mt-1">2m ago</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-4 max-w-xs ml-auto">
          <p className="text-sm">Great! Just finished my finals. How about you?</p>
          <p className="text-xs text-muted-foreground mt-1">1m ago</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 max-w-xs">
          <p className="text-sm">Same here! Want to celebrate at the Rec Center?</p>
          <p className="text-xs text-muted-foreground mt-1">Now</p>
        </div>
      </div>
      
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
        <div className="flex gap-2 max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Type a message..." 
            className="flex-1 px-4 py-2 bg-input rounded-full border border-border focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button size="sm" className="rounded-full px-6">
            Send
          </Button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "discover": return renderDiscoverTab();
      case "matches": return renderMatchesTab();
      case "hotspots": return renderHotspotsTab();
      case "badges": return renderBadgesTab();
      case "profile": return renderProfileTab();
      case "chat": return renderChatTab();
      default: return renderDiscoverTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderContent()}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default MainApp;