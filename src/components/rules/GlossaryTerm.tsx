import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { GlossaryTerm as GlossaryTermType } from '@/data/rules/types';

interface GlossaryTermProps {
  term: GlossaryTermType;
  onJumpTo?: (sectionId: string) => void;
}

export const GlossaryTerm = ({ term, onJumpTo }: GlossaryTermProps) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        type="button"
        className="underline decoration-dotted decoration-secondary/60 underline-offset-4 hover:text-secondary transition-colors cursor-help"
      >
        {term.term}
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-72 text-sm bg-card border-border">
      <div className="font-vhs text-xs text-secondary uppercase tracking-wider mb-1">
        {term.term}
      </div>
      <p className="text-muted-foreground leading-relaxed">{term.short}</p>
      {term.sectionId && onJumpTo && (
        <button
          onClick={() => onJumpTo(term.sectionId!)}
          className="mt-2 text-xs font-vhs uppercase tracking-wider text-primary hover:text-primary/80"
        >
          Jump to section →
        </button>
      )}
    </PopoverContent>
  </Popover>
);
