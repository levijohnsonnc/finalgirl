import killerIcon from '@/assets/icons/killer-icon.png';
import locationIcon from '@/assets/icons/location-icon.png';
import finalGirlIcon from '@/assets/icons/final-girl-icon.png';
import { cn } from '@/lib/utils';

type IconType = 'killer' | 'location' | 'finalGirl';

interface GameIconProps {
  type: IconType;
  className?: string;
}

const iconMap: Record<IconType, string> = {
  killer: killerIcon,
  location: locationIcon,
  finalGirl: finalGirlIcon,
};

const altMap: Record<IconType, string> = {
  killer: 'Killer icon',
  location: 'Location icon',
  finalGirl: 'Final Girl icon',
};

export const GameIcon = ({ type, className }: GameIconProps) => {
  return (
    <img
      src={iconMap[type]}
      alt={altMap[type]}
      className={cn('w-10 h-10 object-contain', className)}
    />
  );
};
