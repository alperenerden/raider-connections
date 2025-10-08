import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import RaiderRashLogo from "@/components/RaiderRashLogo";
import { Mail } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-700 via-gray-600 to-gray-500 flex flex-col items-center justify-between p-6 text-white">
      {/* Logo Section */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8">
        <RaiderRashLogo size="xl" className="animate-fade-in" />
        
        <h1 className="text-4xl font-bold tracking-tight">raider rash</h1>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-md space-y-4">
        {/* Terms Text */}
        <p className="text-center text-sm text-white/90 px-4">
          By tapping Sign In, you agree to our{' '}
          <span className="underline font-semibold">Terms</span>. Learn how we process your data in our{' '}
          <span className="underline font-semibold">Privacy Policy</span> and{' '}
          <span className="underline font-semibold">Cookies Policy</span>.
        </p>

        {/* Button */}
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="w-full h-14 rounded-full border-2 border-white bg-transparent hover:bg-white/10 text-white font-semibold text-base flex items-center justify-center gap-3"
          >
            <Mail className="w-5 h-5" />
            SIGN IN WITH TTU EMAIL
          </Button>
        </div>

        {/* Trouble Signing In */}
        <button 
          onClick={() => navigate("/auth")}
          className="w-full text-center text-white font-medium hover:underline"
        >
          Trouble Signing In?
        </button>
      </div>
    </div>
  );
};

export default LandingPage;