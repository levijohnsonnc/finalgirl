import { Switch } from '@/components/ui/switch';
import { FeatureFilm } from '@/types/gameData';
import { Skull, MapPin, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilmToggleProps {
  film: FeatureFilm;
  isOwned: boolean;
  onToggle: (filmId: string) => void;
}

export const FilmToggle = ({ film, isOwned, onToggle }: FilmToggleProps) => {
  return (
    <div 
      className={cn(
        "glass-card p-4 rounded transition-all duration-300",
        isOwned 
          ? "border-primary/50 shadow-blood" 
          : "border-border hover:border-muted-foreground/50"
      )}
    >
      <div className="flex gap-4">
        {/* Box Art */}
        {film.boxArt && (
          <div className="flex-shrink-0 w-20">
            <img 
              src={film.boxArt} 
              alt={`${film.name} box art`}
              className={cn(
                "w-full h-auto rounded border-2 transition-all",
                isOwned ? "border-primary/50 shadow-blood" : "border-border opacity-60"
              )}
            />
          </div>
        )}

        <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-title text-lg truncate transition-colors mb-2",
              isOwned ? "text-primary blood-glow" : "text-foreground"
            )}>
              {film.name}
            </h3>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                <Skull className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isOwned ? "text-primary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-vhs truncate",
                  isOwned ? "text-foreground" : "text-muted-foreground"
                )}>
                  {film.killer}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isOwned ? "text-secondary" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-vhs truncate",
                  isOwned ? "text-foreground" : "text-muted-foreground"
                )}>
                  {film.location}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className={cn(
                  "w-4 h-4 flex-shrink-0",
                  isOwned ? "text-accent" : "text-muted-foreground"
                )} />
                <span className={cn(
                  "font-vhs truncate",
                  isOwned ? "text-foreground" : "text-muted-foreground"
                )}>
                  {film.finalGirls.join(' & ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Switch
              checked={isOwned}
              onCheckedChange={() => onToggle(film.id)}
              className="data-[state=checked]:bg-primary"
            />
            <span className="font-vhs text-[10px] text-muted-foreground uppercase">
              {isOwned ? 'Owned' : 'Unowned'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
