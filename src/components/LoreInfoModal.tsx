import { Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FEATURE_FILM_DETAILS } from '@/types/featureFilmDetails';
import { KILLER_DESCRIPTIONS } from '@/data/killerDescriptions';
import { LOCATION_DESCRIPTIONS } from '@/data/locationDescriptions';
import { FINAL_GIRL_DESCRIPTIONS } from '@/data/finalGirlDescriptions';
import { CHARACTER_IMAGES, LOCATION_IMAGES, FEATURE_FILMS } from '@/types/gameData';

interface LoreInfoModalProps {
  type: 'killer' | 'location' | 'finalGirl';
  name: string;
}

// Helper to find detailed lore for a character/location
const getLoreDetails = (type: 'killer' | 'location' | 'finalGirl', name: string) => {
  // Search through all feature films to find matching entity
  for (const filmDetails of Object.values(FEATURE_FILM_DETAILS)) {
    if (type === 'killer' && filmDetails.killer.name === name) {
      return {
        backstory: filmDetails.killer.description,
        visualDescription: KILLER_DESCRIPTIONS[name],
        filmName: FEATURE_FILMS.find(f => f.id === filmDetails.filmId)?.name,
      };
    }
    if (type === 'location' && filmDetails.location.name === name) {
      return {
        backstory: filmDetails.location.description,
        visualDescription: LOCATION_DESCRIPTIONS[name],
        setupCards: filmDetails.location.setupCards,
        events: filmDetails.location.events,
        filmName: FEATURE_FILMS.find(f => f.id === filmDetails.filmId)?.name,
      };
    }
    if (type === 'finalGirl') {
      const finalGirl = filmDetails.finalGirls.find(fg => fg.name === name);
      if (finalGirl) {
        return {
          backstory: finalGirl.backstory,
          visualDescription: FINAL_GIRL_DESCRIPTIONS[name],
          filmName: FEATURE_FILMS.find(f => f.id === filmDetails.filmId)?.name,
        };
      }
    }
  }
  return null;
};

// Get image for display
const getImage = (type: 'killer' | 'location' | 'finalGirl', name: string) => {
  if (type === 'killer' || type === 'finalGirl') {
    return CHARACTER_IMAGES[name];
  }
  if (type === 'location') {
    return LOCATION_IMAGES[name];
  }
  return null;
};

const TYPE_LABELS = {
  killer: 'Killer',
  location: 'Location',
  finalGirl: 'Final Girl',
};

export const LoreInfoModal = ({ type, name }: LoreInfoModalProps) => {
  const lore = getLoreDetails(type, name);
  const image = getImage(type, name);

  if (!lore) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="p-1 rounded-full hover:bg-primary/20 transition-colors group"
          aria-label={`View ${name} info`}
        >
          <Info className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border-primary/30 max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-display">
              {TYPE_LABELS[type]}
            </span>
            {lore.filmName && (
              <>
                <span className="text-muted-foreground/50">•</span>
                <span className="text-xs text-primary/70 font-display">{lore.filmName}</span>
              </>
            )}
          </div>
          <DialogTitle className="font-display text-2xl tracking-wide text-foreground">
            {name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Character/Location Image */}
            {image && (
              <div className="relative w-full aspect-video rounded-sm overflow-hidden">
                <img
                  src={image}
                  alt={name}
                  className={`w-full h-full ${type === 'location' ? 'object-cover' : 'object-cover object-top'}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                <div className="absolute inset-0 film-grain pointer-events-none opacity-30" />
              </div>
            )}

            {/* Backstory */}
            {lore.backstory && (
              <div className="space-y-2">
                <h3 className="font-display text-sm uppercase tracking-widest text-primary">
                  {type === 'killer' ? 'Legend' : type === 'location' ? 'Description' : 'Backstory'}
                </h3>
                <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line font-body">
                  {lore.backstory}
                </div>
              </div>
            )}

            {/* Visual Description (for image generation context) */}
            {lore.visualDescription && (
              <div className="space-y-2 border-t border-primary/20 pt-4">
                <h3 className="font-display text-sm uppercase tracking-widest text-muted-foreground">
                  Visual Profile
                </h3>
                <div className="text-xs text-muted-foreground/80 leading-relaxed whitespace-pre-line font-body italic">
                  {lore.visualDescription}
                </div>
              </div>
            )}

            {/* Setup Cards (for locations) */}
            {'setupCards' in lore && lore.setupCards && lore.setupCards.length > 0 && (
              <div className="space-y-3 border-t border-primary/20 pt-4">
                <h3 className="font-display text-sm uppercase tracking-widest text-primary">
                  Setup Scenarios
                </h3>
                <div className="grid gap-2">
                  {lore.setupCards.map((card, idx) => (
                    <div key={idx} className="bg-primary/5 rounded-sm p-3 border border-primary/10">
                      <div className="font-display text-sm text-foreground">{card.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{card.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Events (for locations) */}
            {'events' in lore && lore.events && lore.events.length > 0 && (
              <div className="space-y-3 border-t border-primary/20 pt-4">
                <h3 className="font-display text-sm uppercase tracking-widest text-primary">
                  Events
                </h3>
                <div className="grid gap-2">
                  {lore.events.slice(0, 5).map((event, idx) => (
                    <div key={idx} className="bg-primary/5 rounded-sm p-3 border border-primary/10">
                      <div className="font-display text-sm text-foreground">{event.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{event.description}</div>
                    </div>
                  ))}
                  {lore.events.length > 5 && (
                    <div className="text-xs text-muted-foreground/50 text-center italic">
                      ...and {lore.events.length - 5} more events
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
