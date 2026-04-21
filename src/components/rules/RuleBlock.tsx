import { RuleBlock as RuleBlockType, GlossaryTerm as GlossaryTermType } from '@/data/rules/types';
import { GlossaryTerm } from './GlossaryTerm';
import { AlertTriangle, Info, Lightbulb, Pencil } from 'lucide-react';

interface RuleBlockProps {
  block: RuleBlockType;
  glossary: GlossaryTermType[];
  onJumpTo: (sectionId: string) => void;
}

// Replace glossary terms in a string with React nodes (case-insensitive, longest match first).
function renderText(text: string, glossary: GlossaryTermType[], onJumpTo: (id: string) => void): React.ReactNode {
  if (glossary.length === 0) return text;
  // Sort by length desc to prefer longer matches
  const terms = [...glossary].sort((a, b) => b.term.length - a.term.length);
  const pattern = new RegExp(`\\b(${terms.map((t) => t.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'gi');

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  const used = new Set<string>(); // only highlight first occurrence per block

  while ((match = pattern.exec(text)) !== null) {
    const matched = match[0];
    const lowerKey = matched.toLowerCase();
    const term = terms.find((t) => t.term.toLowerCase() === lowerKey);
    if (!term || used.has(term.id)) continue;
    used.add(term.id);
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index));
    parts.push(
      <GlossaryTerm key={`${term.id}-${match.index}`} term={term} onJumpTo={onJumpTo} />
    );
    lastIndex = match.index + matched.length;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts.length > 0 ? parts : text;
}

const calloutStyles: Record<string, { className: string; icon: React.ReactNode; defaultTitle: string }> = {
  note: {
    className: 'border-secondary/40 bg-secondary/5',
    icon: <Info className="w-4 h-4 text-secondary" />,
    defaultTitle: 'Note',
  },
  critical: {
    className: 'border-primary/50 bg-primary/5',
    icon: <AlertTriangle className="w-4 h-4 text-primary" />,
    defaultTitle: 'Critical',
  },
  designer: {
    className: 'border-muted-foreground/30 bg-muted/30',
    icon: <Pencil className="w-4 h-4 text-muted-foreground" />,
    defaultTitle: "Designer's Note",
  },
  tip: {
    className: 'border-green-500/40 bg-green-500/5',
    icon: <Lightbulb className="w-4 h-4 text-green-400" />,
    defaultTitle: 'Tip',
  },
};

export const RuleBlock = ({ block, glossary, onJumpTo }: RuleBlockProps) => {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-foreground/85 leading-relaxed text-sm sm:text-base">
          {renderText(block.text, glossary, onJumpTo)}
        </p>
      );

    case 'list': {
      const Tag = block.ordered ? 'ol' : 'ul';
      return (
        <Tag
          className={`${block.ordered ? 'list-decimal' : 'list-disc'} pl-6 space-y-1.5 text-foreground/85 text-sm sm:text-base marker:text-secondary/60`}
        >
          {block.items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {renderText(item, glossary, onJumpTo)}
            </li>
          ))}
        </Tag>
      );
    }

    case 'heading': {
      const Tag = block.level === 2 ? 'h3' : 'h4';
      return (
        <Tag className="font-title text-base sm:text-lg text-secondary uppercase tracking-wide mt-4 mb-1">
          {block.text}
        </Tag>
      );
    }

    case 'callout': {
      const variant = block.variant ?? 'note';
      const style = calloutStyles[variant];
      return (
        <div className={`border-l-4 ${style.className} px-3 py-2 sm:px-4 sm:py-3 rounded-r my-2`}>
          <div className="flex items-center gap-2 mb-1">
            {style.icon}
            <span className="font-vhs text-xs uppercase tracking-wider text-foreground/70">
              {block.title ?? style.defaultTitle}
            </span>
          </div>
          <p className="text-sm text-foreground/85 leading-relaxed">
            {renderText(block.text, glossary, onJumpTo)}
          </p>
        </div>
      );
    }

    case 'example':
      return (
        <div className="border border-dashed border-secondary/40 bg-card/50 rounded p-3 sm:p-4 my-2">
          <div className="font-vhs text-xs uppercase tracking-wider text-secondary mb-1">
            Example — {block.title}
          </div>
          <p className="text-sm text-foreground/80 italic leading-relaxed">
            {renderText(block.text, glossary, onJumpTo)}
          </p>
        </div>
      );

    case 'table':
      return (
        <div className="overflow-x-auto my-2 border border-border rounded">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                {block.headers.map((h, i) => (
                  <th key={i} className="text-left px-3 py-2 font-vhs text-xs uppercase tracking-wider text-secondary">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {row.map((cell, j) => (
                    <td key={j} className="px-3 py-2 text-foreground/85 align-top">
                      {renderText(cell, glossary, onJumpTo)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return null;
  }
};
