import { Skull } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TotalTerrorButtonProps {
  onClick: () => void;
  disabled: boolean;
  isAnimating: boolean;
}

export const TotalTerrorButton = ({ onClick, disabled, isAnimating }: TotalTerrorButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative group w-full py-6 px-8 rounded-lg font-horror text-3xl tracking-widest",
        "bg-gradient-to-b from-primary/80 to-primary border-2 border-primary",
        "transition-all duration-300 overflow-hidden",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        !disabled && "hover:from-primary hover:to-primary/90 hover:scale-[1.02]",
        !disabled && "pulse-glow",
        isAnimating && "animate-pulse"
      )}
    >
      {/* Animated blood drip effect on edges */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-8 bg-primary-foreground/30 animate-blood-drip" style={{ animationDelay: '0.2s' }} />
        <div className="absolute top-0 left-1/2 w-2 h-10 bg-primary-foreground/20 animate-blood-drip" style={{ animationDelay: '0.8s' }} />
        <div className="absolute top-0 right-1/4 w-1 h-6 bg-primary-foreground/25 animate-blood-drip" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Glitch overlay on hover */}
      <div className={cn(
        "absolute inset-0 bg-secondary/20 opacity-0 transition-opacity",
        "group-hover:opacity-100 group-hover:animate-pulse"
      )} />

      <div className="relative flex items-center justify-center gap-4">
        <Skull className={cn(
          "w-8 h-8 text-primary-foreground transition-transform",
          "group-hover:rotate-12 group-hover:scale-110",
          isAnimating && "animate-spin"
        )} />
        <span className="text-primary-foreground blood-glow">
          {isAnimating ? 'RANDOMIZING...' : 'TOTAL TERROR'}
        </span>
        <Skull className={cn(
          "w-8 h-8 text-primary-foreground transition-transform",
          "group-hover:-rotate-12 group-hover:scale-110",
          isAnimating && "animate-spin"
        )} />
      </div>

      {/* Static noise overlay */}
      <div className="absolute inset-0 static-bg pointer-events-none" />
    </button>
  );
};
