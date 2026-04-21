import { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, BookMarked, ArrowUp, ChevronDown } from 'lucide-react';
import { coreRules } from '@/data/rules/coreRules';
import { RuleModule, RuleSection as RuleSectionType, RuleBlock } from '@/data/rules/types';
import { RuleSection } from '@/components/rules/RuleSection';
import { RulesTOC } from '@/components/rules/RulesTOC';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MODULES: RuleModule[] = [coreRules];

function blockToText(block: RuleBlock): string {
  switch (block.type) {
    case 'paragraph':
    case 'heading':
      return block.text;
    case 'list':
      return block.items.join(' ');
    case 'callout':
      return `${block.title ?? ''} ${block.text}`;
    case 'example':
      return `${block.title} ${block.text}`;
    case 'table':
      return [...block.headers, ...block.rows.flat()].join(' ');
  }
}

function sectionMatches(section: RuleSectionType, query: string): number {
  if (!query) return 0;
  const q = query.toLowerCase();
  let count = 0;
  if (section.title.toLowerCase().includes(q)) count += 3;
  if (section.tags?.some((t) => t.toLowerCase().includes(q))) count += 2;
  for (const block of section.body) {
    const text = blockToText(block).toLowerCase();
    let idx = 0;
    while ((idx = text.indexOf(q, idx)) !== -1) {
      count += 1;
      idx += q.length;
    }
  }
  return count;
}

const Rules = () => {
  const [moduleId, setModuleId] = useState<string>(MODULES[0].id);
  const [query, setQuery] = useState('');
  const [showTopButton, setShowTopButton] = useState(false);

  const module = MODULES.find((m) => m.id === moduleId) ?? MODULES[0];

  const matchCounts = useMemo(() => {
    if (!query.trim()) return {} as Record<string, number>;
    const counts: Record<string, number> = {};
    for (const s of module.sections) {
      const c = sectionMatches(s, query.trim());
      if (c > 0) counts[s.id] = c;
    }
    return counts;
  }, [query, module]);

  const filteredSections = useMemo(() => {
    if (!query.trim()) return module.sections;
    return module.sections.filter((s) => (matchCounts[s.id] ?? 0) > 0);
  }, [query, matchCounts, module]);

  const sectionIds = useMemo(() => filteredSections.map((s) => s.id), [filteredSections]);
  const activeId = useScrollSpy(sectionIds);

  const handleJumpTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#rules/${id}`);
    }
  }, []);

  // Honor incoming hash on mount
  useEffect(() => {
    const hash = window.location.hash;
    const m = hash.match(/^#rules\/(.+)$/);
    if (m) {
      setTimeout(() => handleJumpTo(m[1]), 100);
    }
  }, [handleJumpTo]);

  // Show "back to top" after scrolling
  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="max-w-7xl mx-auto overflow-x-hidden">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <BookMarked className="w-6 h-6 text-secondary" />
          <h1 className="font-title text-2xl sm:text-3xl uppercase tracking-wide neon-text text-secondary">
            Rulebook
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Unofficial fan reference — see the official rulebook for authoritative text.{' '}
          <a
            href="https://gamers-hq.de/media/pdf/22/ba/4a/FinalGirl_Rules.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-secondary/80 hover:text-secondary underline decoration-dotted"
          >
            Source: Final Girl Core Rulebook ↗
          </a>
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-20 sm:top-24 z-30 bg-background/95 backdrop-blur py-2 -mx-3 px-3 sm:mx-0 sm:px-0 border-b border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-between gap-2 px-3 py-2 border border-border bg-card rounded font-vhs text-xs uppercase tracking-wider hover:bg-muted/50 transition-colors min-w-[180px]">
            <span>{module.title}</span>
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {MODULES.map((m) => (
              <DropdownMenuItem
                key={m.id}
                onClick={() => setModuleId(m.id)}
                className="font-vhs text-xs uppercase tracking-wider"
              >
                {m.title}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem disabled className="font-vhs text-xs uppercase tracking-wider opacity-50">
              Killer & Location modules — coming soon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            inputMode="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules, terms, or icons..."
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded text-base sm:text-sm font-vhs placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>
      </div>

      {/* Mobile ToC dropdown */}
      <div className="lg:hidden mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="w-full flex items-center justify-between gap-2 px-3 py-2 border border-border bg-card rounded font-vhs text-xs uppercase tracking-wider">
            <span>Jump to section…</span>
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-[60vh] overflow-y-auto w-[calc(100vw-1.5rem)]">
            {filteredSections
              .filter((s) => !s.parentId)
              .map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => handleJumpTo(s.id)}
                  className="font-vhs text-xs uppercase tracking-wider"
                >
                  {s.title}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Desktop ToC */}
        <aside className="hidden lg:block sticky top-44 self-start max-h-[calc(100vh-12rem)] overflow-y-auto pr-2">
          <RulesTOC
            sections={filteredSections}
            activeId={activeId}
            matchCounts={matchCounts}
            onJumpTo={handleJumpTo}
          />
        </aside>

        {/* Content */}
        <div className="min-w-0">
          {filteredSections.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground font-vhs uppercase tracking-wider text-sm">
              No rules match "{query}".
            </div>
          ) : (
            filteredSections.map((section) => (
              <RuleSection
                key={section.id}
                section={section}
                allSections={module.sections}
                glossary={module.glossary}
                onJumpTo={handleJumpTo}
              />
            ))
          )}

          <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground/70 font-vhs uppercase tracking-wider">
            {module.source}
          </div>
        </div>
      </div>

      {/* Floating back-to-top */}
      {showTopButton && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 z-40 p-3 rounded-full bg-secondary/20 border border-secondary/50 text-secondary hover:bg-secondary/30 transition-colors backdrop-blur"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default Rules;
