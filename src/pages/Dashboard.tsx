import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Skull, Trophy } from 'lucide-react';
import randomizeAllButton from '@/assets/randomize-all-button.png';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectionSlot } from '@/components/SelectionSlot';
import { SessionLogPanel } from '@/components/SessionLogPanel';
import { StoryGenerator } from '@/components/StoryGenerator';
import { GameIcon } from '@/components/GameIcon';
import { GameSelection, SessionLog, getOwnedContent, getFilmIdByLocation } from '@/types/gameData';
import { getEventsForLocation, getSetupCardsForLocation } from '@/types/featureFilmDetails';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const Dashboard = () => {
  const [ownedFilms] = useLocalStorage<string[]>('final-girl-owned-films', []);
  const [sessionLogs, setSessionLogs] = useLocalStorage<SessionLog[]>('final-girl-session-logs', []);
  
  const [selection, setSelection] = useState<GameSelection>({
    killer: null,
    location: null,
    finalGirl: null,
    startingEvent: '',
    initialSetupCard: '',
  });
  
  const [isAnimating, setIsAnimating] = useState(false);
  const prevLocationRef = useRef<string | null>(null);

  const ownedContent = useMemo(() => getOwnedContent(ownedFilms), [ownedFilms]);

  // Get the film ID based on the selected location
  const filmId = useMemo(() => {
    if (!selection.location) return null;
    return getFilmIdByLocation(selection.location);
  }, [selection.location]);

  // Get available events and setup cards for the current location
  const availableEvents = useMemo(() => {
    if (!filmId) return [];
    return getEventsForLocation(filmId);
  }, [filmId]);

  const availableSetupCards = useMemo(() => {
    if (!filmId) return [];
    return getSetupCardsForLocation(filmId);
  }, [filmId]);

  // Reset event and setup card when location changes
  useEffect(() => {
    if (prevLocationRef.current !== null && prevLocationRef.current !== selection.location) {
      setSelection(prev => ({
        ...prev,
        startingEvent: '',
        initialSetupCard: '',
      }));
    }
    prevLocationRef.current = selection.location;
  }, [selection.location]);

  const getRandomItem = useCallback((items: string[]) => {
    if (items.length === 0) return null;
    return items[Math.floor(Math.random() * items.length)];
  }, []);

  const handleTotalTerror = useCallback(() => {
    if (ownedContent.killers.length === 0) return;
    
    setIsAnimating(true);
    
    // Animate through random selections
    let count = 0;
    const interval = setInterval(() => {
      setSelection(prev => ({
        ...prev,
        killer: getRandomItem(ownedContent.killers),
        location: getRandomItem(ownedContent.locations),
        finalGirl: getRandomItem(ownedContent.finalGirls),
      }));
      count++;
      
      if (count >= 10) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 100);
  }, [ownedContent, getRandomItem]);

  const handleRandomizeSlot = useCallback((slot: 'killer' | 'location' | 'finalGirl') => {
    const items = slot === 'killer' 
      ? ownedContent.killers 
      : slot === 'location' 
        ? ownedContent.locations 
        : ownedContent.finalGirls;
    
    setSelection(prev => ({
      ...prev,
      [slot]: getRandomItem(items),
    }));
  }, [ownedContent, getRandomItem]);

  const handleSelectSlot = useCallback((slot: 'killer' | 'location' | 'finalGirl', value: string) => {
    setSelection(prev => ({
      ...prev,
      [slot]: value,
    }));
  }, []);

  const handleLogMatch = useCallback((result: 'win' | 'loss') => {
    if (!selection.killer || !selection.location || !selection.finalGirl) return;
    
    const newLog: SessionLog = {
      id: uuidv4(),
      date: new Date().toISOString(),
      killer: selection.killer,
      location: selection.location,
      finalGirl: selection.finalGirl,
      result,
    };
    
    setSessionLogs(prev => [...prev, newLog]);
  }, [selection, setSessionLogs]);

  const handleTotalTerrorClick = () => {
    if (isAnimating) return;
    handleTotalTerror();
  };

  const hasSelection = selection.killer && selection.location && selection.finalGirl;
  const hasOwnedContent = ownedFilms.length > 0;
  const hasDetailedData = availableEvents.length > 0 || availableSetupCards.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-5xl text-primary blood-glow tracking-wider">
          PROJECTION ROOM
        </h1>
        <p className="font-vhs text-muted-foreground">
          SELECT YOUR TERROR • FACE YOUR FATE
        </p>
      </div>

      {!hasOwnedContent ? (
        <div className="glass-card p-8 rounded-lg text-center">
          <GameIcon type="killer" className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <h2 className="font-title text-2xl text-foreground mb-2">NO FILMS IN COLLECTION</h2>
          <p className="font-vhs text-muted-foreground">
            Visit THE ARCHIVE to add Feature Films to your collection
          </p>
        </div>
      ) : (
        <>
          {/* Selection Slots with Randomize All */}
          <div className="space-y-4">
            <div className="flex justify-end -my-4">
              <button
                onClick={handleTotalTerrorClick}
                disabled={!hasOwnedContent || isAnimating}
                className={`transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isAnimating ? 'animate-pulse' : ''}`}
              >
                <img 
                  src={randomizeAllButton} 
                  alt="Randomize All" 
                  className="h-24 w-auto"
                />
              </button>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <SelectionSlot
                label="Killer"
                value={selection.killer}
                options={ownedContent.killers}
                onRandomize={() => handleRandomizeSlot('killer')}
                onSelect={(v) => handleSelectSlot('killer', v)}
                icon={<GameIcon type="killer" />}
                accentColor="primary"
              />
              <SelectionSlot
                label="Location"
                value={selection.location}
                options={ownedContent.locations}
                onRandomize={() => handleRandomizeSlot('location')}
                onSelect={(v) => handleSelectSlot('location', v)}
                icon={<GameIcon type="location" />}
                accentColor="secondary"
              />
              <SelectionSlot
                label="Final Girl"
                value={selection.finalGirl}
                options={ownedContent.finalGirls}
                onRandomize={() => handleRandomizeSlot('finalGirl')}
                onSelect={(v) => handleSelectSlot('finalGirl', v)}
                icon={<GameIcon type="finalGirl" />}
                accentColor="accent"
              />
            </div>
          </div>

          {/* Setup Inputs */}
          {hasSelection && (
            <div className="glass-card p-4 rounded-lg">
              <h3 className="font-title text-lg text-foreground mb-4">GAME SETUP</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingEvent" className="font-vhs text-sm text-muted-foreground">
                    STARTING EVENT
                  </Label>
                  {hasDetailedData && availableEvents.length > 0 ? (
                    <Select
                      value={selection.startingEvent}
                      onValueChange={(value) => setSelection(prev => ({ ...prev, startingEvent: value }))}
                    >
                      <SelectTrigger className="vcr-button font-vhs">
                        <SelectValue placeholder="Select starting event..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableEvents.map((event) => (
                          <SelectItem key={event.name} value={event.name} className="font-vhs">
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="vcr-button font-vhs px-3 py-2 text-muted-foreground text-sm">
                      No events available for this location
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setupCard" className="font-vhs text-sm text-muted-foreground">
                    INITIAL SETUP CARD
                  </Label>
                  {hasDetailedData && availableSetupCards.length > 0 ? (
                    <Select
                      value={selection.initialSetupCard}
                      onValueChange={(value) => setSelection(prev => ({ ...prev, initialSetupCard: value }))}
                    >
                      <SelectTrigger className="vcr-button font-vhs">
                        <SelectValue placeholder="Select setup card..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableSetupCards.map((card) => (
                          <SelectItem key={card.name} value={card.name} className="font-vhs">
                            {card.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="vcr-button font-vhs px-3 py-2 text-muted-foreground text-sm">
                      No setup cards available for this location
                    </div>
                  )}
                </div>
              </div>

              {/* Log Match Buttons */}
              <div className="flex gap-4 mt-4">
                <Button
                  onClick={() => handleLogMatch('win')}
                  className="flex-1 vcr-button font-vhs bg-accent/20 hover:bg-accent/30 text-accent border-accent/50"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  LOG WIN
                </Button>
                <Button
                  onClick={() => handleLogMatch('loss')}
                  className="flex-1 vcr-button font-vhs bg-primary/20 hover:bg-primary/30 text-primary border-primary/50"
                >
                  <Skull className="w-4 h-4 mr-2" />
                  LOG LOSS
                </Button>
              </div>
            </div>
          )}

          {/* Story Generator */}
          <StoryGenerator
            killer={selection.killer}
            location={selection.location}
            finalGirl={selection.finalGirl}
            startingEvent={selection.startingEvent || null}
            startingSetup={selection.initialSetupCard || null}
            filmId={filmId}
          />

          {/* Session Log */}
          <SessionLogPanel
            logs={sessionLogs}
            onClearLogs={() => setSessionLogs([])}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
