import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { getFilmIdByLocation, FEATURE_FILMS } from '@/types/gameData';
import { getSetupCardsForLocation, getEventsForLocation } from '@/types/featureFilmDetails';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ScenarioDropdownsProps {
  selectedLocation: string | null;
  onSetupChange?: (setup: string | null) => void;
  onEventChange?: (event: string | null) => void;
}

export const ScenarioDropdowns = ({ 
  selectedLocation, 
  onSetupChange, 
  onEventChange 
}: ScenarioDropdownsProps) => {
  const [selectedSetup, setSelectedSetup] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [showSetupDesc, setShowSetupDesc] = useState(false);
  const [showEventDesc, setShowEventDesc] = useState(false);

  const filmId = selectedLocation ? getFilmIdByLocation(selectedLocation) : null;
  
  const setupCards = useMemo(() => {
    if (!filmId) return [];
    return getSetupCardsForLocation(filmId);
  }, [filmId]);

  const events = useMemo(() => {
    if (!filmId) return [];
    return getEventsForLocation(filmId);
  }, [filmId]);

  const hasData = setupCards.length > 0 || events.length > 0;

  const selectedSetupData = setupCards.find(s => s.name === selectedSetup);
  const selectedEventData = events.find(e => e.name === selectedEvent);

  const handleSetupChange = (value: string) => {
    setSelectedSetup(value);
    setShowSetupDesc(true);
    onSetupChange?.(value);
  };

  const handleEventChange = (value: string) => {
    setSelectedEvent(value);
    setShowEventDesc(true);
    onEventChange?.(value);
  };

  if (!selectedLocation) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Setup Scenario Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Setup Scenario
          </label>
          <Select 
            value={selectedSetup || undefined} 
            onValueChange={handleSetupChange}
            disabled={setupCards.length === 0}
          >
            <SelectTrigger className="scenario-dropdown font-display text-sm tracking-wider uppercase">
              <SelectValue placeholder={setupCards.length > 0 ? "Select Setup..." : "Coming Soon"} />
            </SelectTrigger>
            <SelectContent className="scenario-dropdown-content" side="top">
              {setupCards.map((card) => (
                <SelectItem 
                  key={card.name} 
                  value={card.name}
                  className="font-display text-sm tracking-wide uppercase cursor-pointer focus:bg-primary/20 focus:text-primary-foreground data-[highlighted]:bg-primary/20 data-[highlighted]:text-foreground"
                >
                  {card.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Setup Description */}
          {showSetupDesc && selectedSetupData && (
            <div className="scenario-description mt-2 p-3 rounded-sm">
              <p className="font-vhs text-xs text-muted-foreground leading-relaxed">
                {selectedSetupData.description}
              </p>
            </div>
          )}
        </div>

        {/* Event Dropdown */}
        <div className="flex flex-col gap-2">
          <label className="font-display text-xs text-muted-foreground tracking-[0.2em] uppercase">
            Event
          </label>
          <Select 
            value={selectedEvent || undefined} 
            onValueChange={handleEventChange}
            disabled={events.length === 0}
          >
            <SelectTrigger className="scenario-dropdown font-display text-sm tracking-wider uppercase">
              <SelectValue placeholder={events.length > 0 ? "Select Event..." : "Coming Soon"} />
            </SelectTrigger>
            <SelectContent className="scenario-dropdown-content" side="top">
              {events.map((event) => (
                <SelectItem 
                  key={event.name} 
                  value={event.name}
                  className="font-display text-sm tracking-wide uppercase cursor-pointer focus:bg-primary/20 focus:text-primary-foreground data-[highlighted]:bg-primary/20 data-[highlighted]:text-foreground"
                >
                  {event.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {/* Event Description */}
          {showEventDesc && selectedEventData && (
            <div className="scenario-description mt-2 p-3 rounded-sm">
              <p className="font-vhs text-xs text-muted-foreground leading-relaxed">
                {selectedEventData.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
