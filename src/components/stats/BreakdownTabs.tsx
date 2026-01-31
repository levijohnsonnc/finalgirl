import { ComputedStats } from '@/hooks/useGameStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CHARACTER_IMAGES, LOCATION_IMAGES } from '@/types/gameData';

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
            Final Girls
          </TabsTrigger>
          <TabsTrigger value="killers" className="breakdown-tab">
            Killers
          </TabsTrigger>
          <TabsTrigger value="locations" className="breakdown-tab">
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
                  <TableHead className="text-center hidden sm:table-cell">Saved</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Killed</TableHead>
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
                    <TableCell className="text-center hidden sm:table-cell text-neon-cyan">
                      {fg.totalSaved}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-blood-red">
                      {fg.totalKilled}
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
                  <TableHead className="text-center hidden sm:table-cell">Saved</TableHead>
                  <TableHead className="text-center hidden sm:table-cell">Killed</TableHead>
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
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{loc.plays}</TableCell>
                    <TableCell className="text-center text-neon-cyan">{loc.wins}</TableCell>
                    <TableCell className="text-center">
                      <span className={loc.winRate >= 50 ? 'text-neon-cyan' : 'text-blood-red'}>
                        {Math.round(loc.winRate)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-neon-cyan">
                      {loc.totalSaved}
                    </TableCell>
                    <TableCell className="text-center hidden sm:table-cell text-blood-red">
                      {loc.totalKilled}
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
