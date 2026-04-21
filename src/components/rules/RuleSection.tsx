import { RuleSection as RuleSectionType, GlossaryTerm } from '@/data/rules/types';
import { RuleBlock } from './RuleBlock';
import { ArrowRight } from 'lucide-react';

interface RuleSectionProps {
  section: RuleSectionType;
  allSections: RuleSectionType[];
  glossary: GlossaryTerm[];
  onJumpTo: (id: string) => void;
}

export const RuleSection = ({ section, allSections, glossary, onJumpTo }: RuleSectionProps) => {
  const seeAlsoSections = (section.seeAlso ?? [])
    .map((id) => allSections.find((s) => s.id === id))
    .filter((s): s is RuleSectionType => !!s);

  return (
    <section
      id={section.id}
      className="scroll-mt-28 sm:scroll-mt-32 mb-10"
    >
      <h2 className="font-title text-xl sm:text-2xl text-foreground uppercase tracking-wide mb-3 pb-2 border-b border-border">
        {section.title}
      </h2>
      <div className="space-y-3">
        {section.body.map((block, i) => (
          <RuleBlock key={i} block={block} glossary={glossary} onJumpTo={onJumpTo} />
        ))}
      </div>

      {seeAlsoSections.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="font-vhs text-[10px] uppercase tracking-widest text-muted-foreground">
            See also
          </span>
          {seeAlsoSections.map((s) => (
            <button
              key={s.id}
              onClick={() => onJumpTo(s.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-vhs uppercase tracking-wider rounded border border-secondary/40 bg-secondary/5 text-secondary hover:bg-secondary/15 transition-colors"
            >
              {s.title}
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
};
