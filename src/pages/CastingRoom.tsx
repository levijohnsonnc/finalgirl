import { useState, useCallback, useMemo } from 'react';
import { Play } from 'lucide-react';
import { CastingSlot } from '@/components/CastingSlot';
import { CastingPicker } from '@/components/CastingPicker';
import { ScenarioDropdowns } from '@/components/ScenarioDropdowns';
import { GameIcon } from '@/components/GameIcon';
import { getOwnedContent } from '@/types/gameData';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import castingRoomBg from '@/assets/casting-room-bg.png';

interface CastingSelection {
  killer: string | null;
  location: string | null;
  finalGirl: string | null;
}

const CastingRoom = () => {
  const [ownedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
  
  const [selection, setSelection] = useState<CastingSelection>({
    killer: null,
    location: null,
    finalGirl: null,
  });
  
  const [isShufflingAll, setIsShufflingAll] = useState(false);
  const [shufflingSlot, setShufflingSlot] = useState<'killer' | 'location' | 'finalGirl' | null>(null);
  const [activePicker, setActivePicker] = useState<'killer' | 'location' | 'finalGirl' | null>(null);

  const ownedContent = useMemo(() => getOwnedContent(ownedFilms), [ownedFilms]);
  const hasOwnedContent = ownedFilms.length > 0;
  const isComplete = selection.killer && selection.location && selection.finalGirl;

  const getRandomItem = useCallback((items: string[]) => {
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  }, []);

  // Individual slot shuffle
  const handleSlotShuffle = useCallback((slot: 'killer' | 'location' | 'finalGirl') => {
    if (shufflingSlot) return;
    
    setShufflingSlot(slot);
    
    const items = slot === 'killer' 
      ? ownedContent.killers 
      : slot === 'location' 
        ? ownedContent.locations 
        : ownedContent.finalGirls;
    
    // Quick shuffle animation
    let count = 0;
    const interval = setInterval(() => {
      setSelection(prev => ({
        ...prev,
        [slot]: getRandomItem(items),
      }));
      count++;
      
      if (count >= 8) {
        clearInterval(interval);
        setShufflingSlot(null);
      }
    }, 80);
  }, [shufflingSlot, ownedContent, getRandomItem]);

  // Handle manual selection from picker
  const handleSelect = useCallback((slot: 'killer' | 'location' | 'finalGirl', value: string) => {
    setSelection(prev => ({ ...prev, [slot]: value }));
    setActivePicker(null);
  }, []);

  // Handle press play
  const handlePressPlay = useCallback(() => {
    if (!isComplete) return;
    // TODO: Navigate to "Now Showing" / game setup screen
    console.log('Press Play with:', selection);
  }, [isComplete, selection]);

  if (!hasOwnedContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <GameIcon type="killer" className="w-20 h-20 mb-6 opacity-40" />
        <h2 className="font-display text-3xl text-foreground mb-3 tracking-wider">NO FILMS IN COLLECTION</h2>
        <p className="font-vhs text-muted-foreground max-w-md">
          Visit THE ARCHIVE to add Feature Films to your collection before casting.
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh]">
      {/* Background Image - subtle, atmospheric */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ 
          backgroundImage: `url(${castingRoomBg})`,
          opacity: 0.35,
        }}
      />
      
      {/* Film Grain Overlay - very subtle */}
      <div className="film-grain fixed inset-0 pointer-events-none opacity-[0.07]" />
      
      {/* Vignette */}
      <div className="vignette fixed inset-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-8 pt-24">
        {/* Three Casting Slots - flex layout for different card sizes */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-10 mb-10 md:mb-14 w-full px-4">
          <CastingSlot
            type="killer"
            value={selection.killer}
            options={ownedContent.killers}
            onShuffle={() => handleSlotShuffle('killer')}
            onChoose={() => setActivePicker('killer')}
            isShuffling={isShufflingAll || shufflingSlot === 'killer'}
          />
          <CastingSlot
            type="location"
            value={selection.location}
            options={ownedContent.locations}
            onShuffle={() => handleSlotShuffle('location')}
            onChoose={() => setActivePicker('location')}
            isShuffling={isShufflingAll || shufflingSlot === 'location'}
          />
          <CastingSlot
            type="finalGirl"
            value={selection.finalGirl}
            options={ownedContent.finalGirls}
            onShuffle={() => handleSlotShuffle('finalGirl')}
            onChoose={() => setActivePicker('finalGirl')}
            isShuffling={isShufflingAll || shufflingSlot === 'finalGirl'}
          />
        </div>

        {/* Setup Scenario & Event Dropdowns */}
        <ScenarioDropdowns selectedLocation={selection.location} />

        {/* Final CTA - Locked until complete */}
        <div className="relative">
          <button
            onClick={handlePressPlay}
            disabled={!isComplete}
            className={`
              press-play-btn
              px-8 py-4 md:px-10 md:py-5
              flex items-center gap-3
              font-display text-lg md:text-xl tracking-[0.15em] uppercase
              transition-all duration-500
              ${isComplete 
                ? 'cta-unlocked vcr-tape-button text-foreground' 
                : 'cta-locked text-muted-foreground/50 cursor-not-allowed'
              }
            `}
            title={!isComplete ? 'Cast your feature to begin' : undefined}
          >
            <Play className={`w-5 h-5 ${isComplete ? 'text-primary' : ''}`} />
            <span>Press Play</span>
          </button>
          
          {/* Subtle hint when locked */}
          {!isComplete && (
            <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-vhs text-xs text-muted-foreground/40 whitespace-nowrap">
              Cast your feature to begin
            </p>
          )}
        </div>
      </div>

      {/* Picker Modal */}
      {activePicker && (
        <CastingPicker
          type={activePicker}
          options={
            activePicker === 'killer' 
              ? ownedContent.killers 
              : activePicker === 'location' 
                ? ownedContent.locations 
                : ownedContent.finalGirls
          }
          onSelect={(value) => handleSelect(activePicker, value)}
          onClose={() => setActivePicker(null)}
        />
      )}
    </div>
  );
};

export default CastingRoom;
