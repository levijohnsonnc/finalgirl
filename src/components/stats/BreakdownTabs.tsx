import { ComputedStats } from '@/hooks/useGameStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';
import { Crown, Skull, MapPin, Zap } from 'lucide-react';

interface BreakdownTabsProps {
  stats: ComputedStats;
}

export const BreakdownTabs = ({ stats }: BreakdownTabsProps) => {
  if (stats.gamesPlayed === 0) {
    return null;
  }

  return (
    <div className="breakdown-section">
      <Tabs defaultValue="finalGirls" className="w-full">
        <TabsList className="breakdown-tabs-list">
          <TabsTrigger value="finalGirls" className="breakdown-tab">
            <Crown className="w-4 h-4 mr-1" />
            Final Girls
          </TabsTrigger>
          <TabsTrigger value="killers" className="breakdown-tab">
            <Skull className="w-4 h-4 mr-1" />
            Killers
          </TabsTrigger>
          <TabsTrigger value="locations" className="breakdown-tab">
            <MapPin className="w-4 h-4 mr-1" />
            Locations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="finalGirls" className="breakdown-content">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="breakdown-table-header">
                  <TableHead className="w-[200px]">Final Girl</TableHead>
                  <TableHead className="text-center">Plays</TableHead>
                  <TableHead className="text-center">Wins</TableHead>
                  <TableHead className="text-center">Win %</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Avg Horror</TableHead>
                  <TableHead className="hidden md:table-cell">Top Weapon</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.byFinalGirl.map((fg) => (
                  <TableRow key={fg.name} className="breakdown-table-row">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {CHARACTER_IMAGES[fg.name] && (
                          <img 
                            src={CHARACTER_IMAGES[fg.name]} 
                            alt={fg.name}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                        )}
                        <span className="truncate">{fg.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{fg.plays}</TableCell>
                    <TableCell className="text-center text-neon-cyan">{fg.wins}</TableCell>
                    <TableCell className="text-center">
                      <span className={fg.winRate >= 50 ? 'text-neon-cyan' : 'text-blood-red'}>
                        {Math.round(fg.winRate)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                      {fg.avgHorror?.toFixed(1) || '—'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground truncate max-w-[120px]">
                      {fg.topWeapon || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="killers" className="breakdown-content">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="breakdown-table-header">
                  <TableHead className="w-[200px]">Killer</TableHead>
                  <TableHead className="text-center">Faced</TableHead>
                  <TableHead className="text-center">Escaped</TableHead>
                  <TableHead className="text-center">Escape %</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Avg Saved</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Avg Killed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.byKiller.map((k) => (
                  <TableRow key={k.name} className="breakdown-table-row">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {CHARACTER_IMAGES[k.name] && (
                          <img 
                            src={CHARACTER_IMAGES[k.name]} 
                            alt={k.name}
                            className="w-8 h-8 rounded-full object-cover border border-border"
                          />
                        )}
                        <span className="truncate">{k.name}</span>
                        {k.isNemesis && (
                          <span title="Your Nemesis"><Zap className="w-4 h-4 text-vhs-yellow flex-shrink-0" /></span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{k.plays}</TableCell>
                    <TableCell className="text-center text-neon-cyan">{k.wins}</TableCell>
                    <TableCell className="text-center">
                      <span className={k.winRate >= 50 ? 'text-neon-cyan' : 'text-blood-red'}>
                        {Math.round(k.winRate)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-neon-cyan">
                      {k.avgVictimsSaved?.toFixed(1) || '—'}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-blood-red">
                      {k.avgVictimsKilled?.toFixed(1) || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="breakdown-content">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="breakdown-table-header">
                  <TableHead className="w-[200px]">Location</TableHead>
                  <TableHead className="text-center">Plays</TableHead>
                  <TableHead className="text-center">Wins</TableHead>
                  <TableHead className="text-center">Win %</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Avg Horror</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.byLocation.map((loc) => (
                  <TableRow key={loc.name} className="breakdown-table-row">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {LOCATION_IMAGES[loc.name] && (
                          <img 
                            src={LOCATION_IMAGES[loc.name]} 
                            alt={loc.name}
                            className="w-8 h-8 rounded object-cover border border-border"
                          />
                        )}
                        <span className="truncate">{loc.name}</span>
                        {loc.isMostChaotic && (
                          <span title="Most Chaotic"><Skull className="w-4 h-4 text-blood-red flex-shrink-0" /></span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{loc.plays}</TableCell>
                    <TableCell className="text-center text-neon-cyan">{loc.wins}</TableCell>
                    <TableCell className="text-center">
                      <span className={loc.winRate >= 50 ? 'text-neon-cyan' : 'text-blood-red'}>
                        {Math.round(loc.winRate)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-muted-foreground">
                      {loc.avgHorror?.toFixed(1) || '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
