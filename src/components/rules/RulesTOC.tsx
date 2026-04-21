import { RuleSection } from '@/data/rules/types';

interface RulesTOCProps {
  sections: RuleSection[];
  activeId: string | null;
  matchCounts?: Record<string, number>;
  onJumpTo: (id: string) => void;
}

export const RulesTOC = ({ sections, activeId, matchCounts, onJumpTo }: RulesTOCProps) => {
  const topLevel = sections.filter((s) => !s.parentId);

  return (
    <nav className="space-y-1 font-vhs text-sm">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 pb-2 border-b border-border">
        Table of Contents
      </div>
      {topLevel.map((parent) => {
        const children = sections.filter((s) => s.parentId === parent.id);
        const isActive = activeId === parent.id;
        const parentMatches = matchCounts?.[parent.id] ?? 0;

        return (
          <div key={parent.id}>
            <button
              onClick={() => onJumpTo(parent.id)}
              className={`w-full text-left px-2 py-1.5 rounded transition-colors flex items-center justify-between gap-2 uppercase tracking-wide text-xs ${
                isActive
                  ? 'bg-secondary/15 text-secondary border-l-2 border-secondary'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted/30 border-l-2 border-transparent'
              }`}
            >
              <span className="truncate">{parent.title}</span>
              {parentMatches > 0 && (
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded-full shrink-0">
                  {parentMatches}
                </span>
              )}
            </button>

            {children.length > 0 && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2">
                {children.map((child) => {
                  const childActive = activeId === child.id;
                  const childMatches = matchCounts?.[child.id] ?? 0;
                  return (
                    <button
                      key={child.id}
                      onClick={() => onJumpTo(child.id)}
                      className={`w-full text-left px-2 py-1 rounded transition-colors flex items-center justify-between gap-2 text-[11px] normal-case tracking-normal ${
                        childActive
                          ? 'text-secondary bg-secondary/10'
                          : 'text-muted-foreground hover:text-foreground/90 hover:bg-muted/20'
                      }`}
                    >
                      <span className="truncate">{child.title}</span>
                      {childMatches > 0 && (
                        <span className="text-[9px] bg-primary/20 text-primary px-1.5 rounded-full shrink-0">
                          {childMatches}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};
