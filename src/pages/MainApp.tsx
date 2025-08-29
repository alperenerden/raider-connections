import { useState } from "react";
import Navigation from "@/components/Navigation";
import SwipeCard from "@/components/SwipeCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RaiderRashLogo from "@/components/RaiderRashLogo";
import { Heart, MessageCircle, MapPin, Settings, User, Filter } from "lucide-react";

interface MainAppProps {
  onLogout: () => void;
}

const MainApp = ({ onLogout }: MainAppProps) => {
  const [activeTab, setActiveTab] = useState("discover");

  // Mock data for demo
  const mockProfiles = [
    {
      id: "1",
      name: "Sarah",
      age: 21,
      major: "Business Administration",
      year: "Junior",
      bio: "Love going to football games and exploring Lubbock! Looking for someone to grab coffee with between classes ☕",
      interests: ["Football", "Coffee", "Greek Life", "Photography", "Music"],
      images: ["https://picsum.photos/400/600?random=1"],
      distance: "0.5 mi",
    },
    {
      id: "2", 
      name: "Jake",
      age: 22,
      major: "Engineering",
      year: "Senior",
      bio: "Engineering student who loves Red Raider sports. Always down for a good time at the Rec Center 🏀",
      interests: ["Basketball", "Engineering", "Gaming", "Movies", "Fitness"],
      images: ["https://picsum.photos/400/600?random=2"],
      distance: "1.2 mi",
    }
  ];

  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleSwipe = (direction: "left" | "right") => {
    console.log(`Swiped ${direction} on profile ${mockProfiles[currentProfileIndex]?.name}`);
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(currentProfileIndex + 1);
    } else {
      setCurrentProfileIndex(0); // Loop back for demo
    }
  };

  const renderDiscoverTab = () => (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      <div className="flex items-center justify-between w-full max-w-sm mb-4">
        <RaiderRashLogo size="sm" />
        <h2 className="text-xl font-bold">Discover</h2>
        <Button variant="ghost" size="icon">
          <Filter className="w-5 h-5" />
        </Button>
      </div>

      {mockProfiles[currentProfileIndex] ? (
        <SwipeCard 
          profile={mockProfiles[currentProfileIndex]} 
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
  );

  const renderMatchesTab = () => (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Your Matches</h2>
        <Badge variant="secondary">{mockMatches.length}</Badge>
      </div>
      
      <div className="space-y-4">
        {mockMatches.map((match) => (
          <div key={match.id} className="flex items-center gap-4 p-4 gradient-card rounded-lg">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">{match.name}</h3>
              <p className="text-sm text-muted-foreground">{match.lastMessage}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{match.time}</p>
              {match.unread && (
                <div className="w-3 h-3 bg-primary rounded-full ml-auto mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHotspotsTab = () => (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Campus Hotspots</h2>
        <MapPin className="w-6 h-6 text-primary" />
      </div>
      
      <div className="space-y-4">
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

  const renderProfileTab = () => (
    <div className="p-4 pb-20">
      <div className="text-center space-y-6">
        <div className="w-32 h-32 bg-gradient-primary rounded-full mx-auto flex items-center justify-center">
          <User className="w-16 h-16 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">Demo User</h2>
          <p className="text-muted-foreground">Computer Science • Senior</p>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full">
            Account Settings  
          </Button>
          <Button variant="destructive" className="w-full" onClick={onLogout}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  const mockMatches = [
    { id: "1", name: "Sarah M.", lastMessage: "Hey! How's your semester going?", time: "2m", unread: true },
    { id: "2", name: "Jake R.", lastMessage: "Want to study together?", time: "1h", unread: false },
    { id: "3", name: "Emma L.", lastMessage: "See you at the game!", time: "3h", unread: false },
  ];

  const mockHotspots = [
    { id: "1", name: "Student Union Building", description: "Great place to meet between classes", activeUsers: 23 },
    { id: "2", name: "Rec Center", description: "Work out and meet fitness enthusiasts", activeUsers: 15 },
    { id: "3", name: "Library Study Rooms", description: "Find study partners for your major", activeUsers: 8 },
    { id: "4", name: "Jones AT&T Stadium", description: "Game day connections!", activeUsers: 156 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "discover": return renderDiscoverTab();
      case "matches": return renderMatchesTab();
      case "hotspots": return renderHotspotsTab();
      case "profile": return renderProfileTab();
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