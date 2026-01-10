import { useState, useCallback, useMemo } from 'react';
import { Skull, MapPin, User, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TotalTerrorButton } from '@/components/TotalTerrorButton';
import { SelectionSlot } from '@/components/SelectionSlot';
import { SessionLogPanel } from '@/components/SessionLogPanel';
import { StoryGenerator } from '@/components/StoryGenerator';
import { GameSelection, SessionLog, getOwnedContent } from '@/types/gameData';
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

  const ownedContent = useMemo(() => getOwnedContent(ownedFilms), [ownedFilms]);

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

  const hasSelection = selection.killer && selection.location && selection.finalGirl;
  const hasOwnedContent = ownedFilms.length > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="font-horror text-5xl text-primary blood-glow tracking-wider">
          PROJECTION ROOM
        </h1>
        <p className="font-vhs text-muted-foreground">
          SELECT YOUR TERROR • FACE YOUR FATE
        </p>
      </div>

      {!hasOwnedContent ? (
        <div className="glass-card p-8 rounded-lg text-center">
          <Skull className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
          <h2 className="font-title text-2xl text-foreground mb-2">NO FILMS IN COLLECTION</h2>
          <p className="font-vhs text-muted-foreground">
            Visit THE ARCHIVE to add Feature Films to your collection
          </p>
        </div>
      ) : (
        <>
          {/* Total Terror Button */}
          <TotalTerrorButton
            onClick={handleTotalTerror}
            disabled={!hasOwnedContent}
            isAnimating={isAnimating}
          />

          {/* Selection Slots */}
          <div className="grid md:grid-cols-3 gap-4">
            <SelectionSlot
              label="Killer"
              value={selection.killer}
              options={ownedContent.killers}
              onRandomize={() => handleRandomizeSlot('killer')}
              onSelect={(v) => handleSelectSlot('killer', v)}
              icon={<Skull className="w-5 h-5" />}
              accentColor="primary"
            />
            <SelectionSlot
              label="Location"
              value={selection.location}
              options={ownedContent.locations}
              onRandomize={() => handleRandomizeSlot('location')}
              onSelect={(v) => handleSelectSlot('location', v)}
              icon={<MapPin className="w-5 h-5" />}
              accentColor="secondary"
            />
            <SelectionSlot
              label="Final Girl"
              value={selection.finalGirl}
              options={ownedContent.finalGirls}
              onRandomize={() => handleRandomizeSlot('finalGirl')}
              onSelect={(v) => handleSelectSlot('finalGirl', v)}
              icon={<User className="w-5 h-5" />}
              accentColor="accent"
            />
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
                  <Input
                    id="startingEvent"
                    value={selection.startingEvent}
                    onChange={(e) => setSelection(prev => ({ ...prev, startingEvent: e.target.value }))}
                    placeholder="Enter starting event..."
                    className="vcr-button font-vhs"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setupCard" className="font-vhs text-sm text-muted-foreground">
                    INITIAL SETUP CARD
                  </Label>
                  <Input
                    id="setupCard"
                    value={selection.initialSetupCard}
                    onChange={(e) => setSelection(prev => ({ ...prev, initialSetupCard: e.target.value }))}
                    placeholder="Enter setup card..."
                    className="vcr-button font-vhs"
                  />
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
