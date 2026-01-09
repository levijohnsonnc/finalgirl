import { SessionLog } from '@/types/gameData';
import { Trophy, Skull, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SessionLogPanelProps {
  logs: SessionLog[];
  onClearLogs: () => void;
}

export const SessionLogPanel = ({ logs, onClearLogs }: SessionLogPanelProps) => {
  const wins = logs.filter(l => l.result === 'win').length;
  const losses = logs.filter(l => l.result === 'loss').length;

  return (
    <div className="glass-card p-4 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-title text-xl text-foreground tracking-wide">
          MATCH HISTORY
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="font-vhs text-accent">{wins}</span>
          </div>
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4 text-primary" />
            <span className="font-vhs text-primary">{losses}</span>
          </div>
          {logs.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearLogs}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        {logs.length === 0 ? (
          <p className="font-vhs text-sm text-muted-foreground text-center py-4">
            [ NO MATCHES RECORDED ]
          </p>
        ) : (
          logs.slice().reverse().map((log) => (
            <div 
              key={log.id}
              className={cn(
                "flex items-center justify-between p-2 rounded bg-background/50 border",
                log.result === 'win' ? 'border-accent/30' : 'border-primary/30'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs font-vhs text-muted-foreground mb-1">
                  <span>{new Date(log.date).toLocaleDateString()}</span>
                </div>
                <div className="font-vhs text-sm truncate">
                  <span className="text-primary">{log.killer}</span>
                  <span className="text-muted-foreground"> vs </span>
                  <span className="text-accent">{log.finalGirl}</span>
                  <span className="text-muted-foreground"> @ </span>
                  <span className="text-secondary">{log.location}</span>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded font-vhs text-xs uppercase",
                log.result === 'win' 
                  ? 'bg-accent/20 text-accent' 
                  : 'bg-primary/20 text-primary'
              )}>
                {log.result === 'win' ? (
                  <><Trophy className="w-3 h-3" /> Win</>
                ) : (
                  <><Skull className="w-3 h-3" /> Loss</>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
