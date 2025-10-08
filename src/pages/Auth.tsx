import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import RaiderRashLogo from "@/components/RaiderRashLogo";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate("/app");
      } else {
        // Signup
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
              age: parseInt(age) || null,
            },
            emailRedirectTo: `${window.location.origin}/app`,
          },
        });

        if (error) throw error;

        toast({
          title: "Account created!",
          description: "Welcome to Raider Rash",
        });
        navigate("/app");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          ← Back
        </Button>

        {/* Logo and Title */}
        <div className="flex flex-col items-center text-center space-y-3">
          <RaiderRashLogo size="lg" />
          <h1 className="text-3xl font-bold">
            {isLogin ? "Welcome Back" : "Join Raider Rash"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Log in to continue" : "Create your account"}
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
          <Button
            variant={isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(true)}
          >
            Log In
          </Button>
          <Button
            variant={!isLogin ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </Button>
        </div>

        {/* Auth Form */}
        <div className="bg-card rounded-lg p-6 shadow-lg border">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Name</label>
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Age</label>
                  <Input
                    type="number"
                    placeholder="18+"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="18"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">TTU Email</label>
              <Input
                type="email"
                placeholder="your.email@ttu.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              size="lg"
            >
              {loading ? "Loading..." : isLogin ? "Log In" : "Create Account"}
            </Button>
          </form>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-muted-foreground px-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}