import { PlayerArchetype as ArchetypeType } from '@/hooks/useGameStats';

interface PlayerArchetypeProps {
  archetype: ArchetypeType;
  reason: string;
}

const archetypeConfig: Record<ArchetypeType, {
  name: string;
  color: string;
  bgClass: string;
}> = {
  protector: {
    name: 'The Protector',
    color: 'text-neon-cyan',
    bgClass: 'archetype-protector'
  },
  duelist: {
    name: 'The Duelist',
    color: 'text-vhs-yellow',
    bgClass: 'archetype-duelist'
  },
  survivor: {
    name: 'The Survivor',
    color: 'text-blood-red',
    bgClass: 'archetype-survivor'
  },
  gambler: {
    name: 'The Gambler',
    color: 'text-purple-400',
    bgClass: 'archetype-gambler'
  },
  newcomer: {
    name: 'Newcomer',
    color: 'text-muted-foreground',
    bgClass: 'archetype-newcomer'
  }
};

export const PlayerArchetypeBadge = ({ archetype, reason }: PlayerArchetypeProps) => {
  const config = archetypeConfig[archetype];

  return (
    <div className={`archetype-badge ${config.bgClass}`}>
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
