interface AppHeaderProps {
  onNavigateHome: () => void;
}

export const AppHeader = ({ onNavigateHome }: AppHeaderProps) => {
  return (
    <button
      onClick={onNavigateHome}
      className="absolute top-8 left-8 md:top-12 md:left-12 z-10 text-left hover:opacity-80 transition-opacity"
    >
      <h1 
        className="text-3xl md:text-4xl lg:text-5xl tracking-wider text-foreground/65 mb-1 drop-shadow-lg"
        style={{ fontFamily: 'var(--font-display)', fontWeight: 500, textShadow: '2px 2px 8px rgba(0,0,0,0.8)' }}
      >
        FINAL GIRL
      </h1>
      <p 
        className="text-base md:text-lg tracking-[0.3em] uppercase text-foreground/50 drop-shadow-md"
        style={{ fontFamily: 'var(--font-vhs)', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}
      >
        Slasher Companion
      </p>
    </button>
  );
};
