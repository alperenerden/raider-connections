import { useState } from "react";
import { Heart, X, MapPin, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SwipeCardProps {
  profile: {
    id: string;
    name: string;
    age: number;
    major: string;
    year: string;
    bio: string;
    interests: string[];
    images: string[];
    distance?: string;
  };
  onSwipe: (direction: "left" | "right") => void;
}

const SwipeCard = ({ profile, onSwipe }: SwipeCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const handleSwipe = (direction: "left" | "right") => {
    setIsLiked(direction === "right");
    setTimeout(() => {
      onSwipe(direction);
      setIsLiked(null);
      setCurrentImageIndex(0);
    }, 300);
  };

  return (
    <div className={`swipe-card w-full max-w-sm mx-auto transform transition-all duration-300 no-select ${
      isLiked === true ? "scale-110 rotate-12" : 
      isLiked === false ? "scale-110 -rotate-12" : ""
    }`}>
      {/* Image Section */}
      <div className="relative h-96 bg-muted">
        {profile.images[currentImageIndex] ? (
          <img 
            src={profile.images[currentImageIndex]} 
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-dark">
            <span className="text-muted-foreground text-6xl">📸</span>
          </div>
        )}
        
        {/* Image indicators */}
        {profile.images.length > 1 && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-1">
            {profile.images.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentImageIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}

        {/* Swipe overlay */}
        {isLiked !== null && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            isLiked ? "bg-primary/80" : "bg-muted/80"
          }`}>
            <div className="text-white text-6xl">
              {isLiked ? "❤️" : "👎"}
            </div>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">{profile.name}, {profile.age}</h3>
          {profile.distance && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{profile.distance}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="w-4 h-4" />
          <span>{profile.major} • {profile.year}</span>
        </div>

        <p className="text-foreground/80 line-clamp-3">{profile.bio}</p>

        {/* Interests */}
        <div className="flex flex-wrap gap-2">
          {profile.interests.slice(0, 6).map((interest) => (
            <Badge key={interest} variant="secondary" className="text-xs">
              {interest}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="swipe"
            size="icon"
            className="w-14 h-14 rounded-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground touch-target"
            onClick={() => handleSwipe("left")}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <Button
            variant="hero"
            size="icon"
            className="w-14 h-14 rounded-full touch-target"
            onClick={() => handleSwipe("right")}
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;