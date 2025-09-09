import raiderRashLogo from "@/assets/raider-rash-logo.png";

interface RaiderRashLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const RaiderRashLogo = ({ size = "md", className = "" }: RaiderRashLogoProps) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-16 h-16", 
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        <img 
          src={raiderRashLogo} 
          alt="Raider Rash" 
          className={`${sizeClasses[size]} object-contain drop-shadow-sm transition-smooth hover:scale-105 hover:drop-shadow-md`}
          style={{ 
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
            filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))'
          }}
        />
      </div>
    </div>
  );
};

export default RaiderRashLogo;