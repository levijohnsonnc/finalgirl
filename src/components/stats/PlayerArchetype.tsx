import { PlayerArchetype as ArchetypeType } from '@/hooks/useGameStats';
import { Shield, Swords, Heart, Dices, HelpCircle } from 'lucide-react';

interface PlayerArchetypeProps {
  archetype: ArchetypeType;
  reason: string;
}

const archetypeConfig: Record<ArchetypeType, {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgClass: string;
}> = {
  protector: {
    name: 'The Protector',
    icon: <Shield className="w-6 h-6" />,
    color: 'text-neon-cyan',
    bgClass: 'archetype-protector'
  },
  duelist: {
    name: 'The Duelist',
    icon: <Swords className="w-6 h-6" />,
    color: 'text-vhs-yellow',
    bgClass: 'archetype-duelist'
  },
  survivor: {
    name: 'The Survivor',
    icon: <Heart className="w-6 h-6" />,
    color: 'text-blood-red',
    bgClass: 'archetype-survivor'
  },
  gambler: {
    name: 'The Gambler',
    icon: <Dices className="w-6 h-6" />,
    color: 'text-purple-400',
    bgClass: 'archetype-gambler'
  },
  newcomer: {
    name: 'Newcomer',
    icon: <HelpCircle className="w-6 h-6" />,
    color: 'text-muted-foreground',
    bgClass: 'archetype-newcomer'
  }
};

export const PlayerArchetypeBadge = ({ archetype, reason }: PlayerArchetypeProps) => {
  const config = archetypeConfig[archetype];

  return (
    <div className={`archetype-badge ${config.bgClass}`}>
      <div className={`archetype-icon ${config.color}`}>
        {config.icon}
      </div>
      <div className="archetype-content">
        <div className={`archetype-name ${config.color}`}>
          {config.name}
        </div>
        <div className="archetype-reason">
          {reason}
        </div>
      </div>
    </div>
  );
};
