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
    <div className={`relative ${className}`}>
      <img 
        src={raiderRashLogo} 
        alt="Raider Rash" 
        className={`${sizeClasses[size]} object-contain transition-smooth hover:scale-105`}
      />
    </div>
  );
};

export default RaiderRashLogo;