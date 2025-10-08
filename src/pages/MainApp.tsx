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
                console.log(`Opening chat with ${match.matchedProfile.display_name}`);
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
      major: "Computer Science", 
      year: "Senior",
      bio: "Love coding, Red Raider football, and meeting new people on campus! Always down for coffee and discussing the latest tech trends.",
      interests: ["Coding", "Football", "Coffee", "Gaming", "Photography"],
      profileCompletion: 85
    };

    return (
      <div className="min-h-screen overflow-y-auto pb-20">
        <div className="space-y-6 p-4">
          <div className="text-center">
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src="/placeholder.svg" alt="Your profile" />
              <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold text-primary">{userData.name}</h2>
            <p className="text-muted-foreground">{userData.year} • {userData.major}</p>
            <p className="text-sm text-muted-foreground">Matches: {matches.length}</p>
            
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Profile Completion</span>
                <span className="text-sm text-primary font-semibold">{userData.profileCompletion}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${userData.profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80">{userData.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {userData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Display selected badges */}
          {getDisplayedBadges().length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Infections</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Preferences
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Privacy Settings
              </Button>
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
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