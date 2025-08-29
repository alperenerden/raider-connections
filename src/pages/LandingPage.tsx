import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RaiderRashLogo from "@/components/RaiderRashLogo";
import { Heart, Shield, Users, Zap, Mail, Lock } from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: LandingPageProps) => {
  const [showIntro, setShowIntro] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent, type: "login" | "signup") => {
    e.preventDefault();
    // For now, just simulate login
    onLogin();
  };

  const skipIntro = () => {
    setShowIntro(false);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen gradient-dark flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Animated Logo */}
          <div className="animate-scale-in animation-delay-500">
            <RaiderRashLogo size="xl" className="mx-auto transform hover:scale-105 transition-transform duration-300" />
          </div>
          
          {/* Animated Hook Text */}
          <div className="space-y-4 animate-fade-in animation-delay-1000">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-red-500 via-red-400 to-orange-400 bg-clip-text text-transparent animate-pulse">
              Ready to catch
            </h1>
            <h2 className="text-5xl font-bold text-white animate-bounce animation-delay-1500">
              something?
            </h2>
          </div>
          
          {/* Animated Tagline */}
          <div className="animate-fade-in animation-delay-2000">
            <p className="text-2xl text-red-300 font-semibold">
              It's time to spread the Rash! 🔥
            </p>
            <p className="text-lg text-gray-300 mt-2">
              Texas Tech's hottest dating app
            </p>
          </div>
          
          {/* Skip Button */}
          <div className="animate-fade-in animation-delay-2500">
            <Button 
              onClick={skipIntro}
              variant="outline" 
              className="mt-8 border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition-all duration-300"
            >
              Skip Intro
            </Button>
          </div>
        </div>
        
        {/* Floating Hearts Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <Heart 
              key={i}
              className={`absolute text-red-400/20 w-8 h-8 animate-bounce animation-delay-${(i + 1) * 300}`}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 2) * 40}%`,
                animationDuration: `${2 + i * 0.5}s`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dark flex flex-col items-center justify-center p-4">
      {/* Hero Section */}
      <div className="text-center mb-8 space-y-6">
        <RaiderRashLogo size="xl" className="mx-auto" />
        
        <div className="space-y-2">
          <h1 className="text-hero">Raider Rash</h1>
          <p className="text-xl text-muted-foreground max-w-md mx-auto">
            Find your match at Texas Tech.
          </p>
          <p className="text-lg font-semibold text-primary">
            Swipe. Match. Wreck 'Em.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-center">
          <div className="flex flex-col items-center gap-2 p-4">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">TTU Verified</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <Users className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Campus Events</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <Heart className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Smart Matching</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4">
            <Zap className="w-8 h-8 text-primary" />
            <span className="text-sm font-medium">Hotspots</span>
          </div>
        </div>
      </div>

      {/* Auth Card */}
      <Card className="w-full max-w-md gradient-card shadow-dark">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Join the Raiders</CardTitle>
          <CardDescription>
            Connect with verified Texas Tech students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your.email@ttu.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button type="submit" variant="hero" className="w-full">
                  Login to Raider Rash
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={(e) => handleSubmit(e, "signup")} className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your.email@ttu.edu"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground text-center">
                  By signing up, you agree to verify your TTU student status
                </div>
                
                <Button type="submit" variant="hero" className="w-full">
                  Join Raider Rash
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>For verified Texas Tech students only</p>
        <p className="mt-2">Made with ❤️ for Red Raiders</p>
      </div>
    </div>
  );
};

export default LandingPage;