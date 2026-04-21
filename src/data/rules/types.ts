export type RuleBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'callout'; variant?: 'note' | 'critical' | 'designer' | 'tip'; title?: string; text: string }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'example'; title: string; text: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

export interface RuleSection {
  id: string;
  title: string;
  parentId?: string;
  order: number;
  body: RuleBlock[];
  seeAlso?: string[];
  tags?: string[];
  source?: string;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  short: string;
  sectionId?: string;
}

export interface RuleModule {
  id: string;
  title: string;
  source: string;
  sections: RuleSection[];
  glossary: GlossaryTerm[];
}
