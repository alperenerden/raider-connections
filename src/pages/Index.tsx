import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LandingPage from "./LandingPage";
import MainApp from "./MainApp";

const Index = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setShowLanding(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setShowLanding(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedLanding");
    if (hasVisited && !user) {
      setShowLanding(false);
    }
  }, [user]);

  const handleEnterApp = () => {
    if (user) {
      localStorage.setItem("hasVisitedLanding", "true");
      setShowLanding(false);
    } else {
      navigate("/auth");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLanding(true);
    setUser(null);
    localStorage.removeItem("hasVisitedLanding");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return showLanding ? (
    <LandingPage onLogin={handleEnterApp} />
  ) : user ? (
    <MainApp onLogout={handleLogout} />
  ) : (
    <LandingPage onLogin={handleEnterApp} />
  );
};

export default Index;
