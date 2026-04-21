import { useRef, useEffect } from 'react';

interface SubTab {
  id: string;
  label: string;
}

interface RuleSubTabsProps {
  tabs: SubTab[];
  activeId: string;
  onSelect: (id: string) => void;
}

export const RuleSubTabs = ({ tabs, activeId, onSelect }: RuleSubTabsProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Keep active tab visible on mobile horizontal scroll
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const active = scroller.querySelector<HTMLButtonElement>(`[data-tab-id="${activeId}"]`);
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  if (tabs.length <= 1) return null;

  return (
    <div className="binder-tabs-wrap relative -mx-1">
      <div
        ref={scrollerRef}
        className="binder-tabs flex gap-1 overflow-x-auto px-1 pb-1 scrollbar-thin"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelect(tab.id)}
              className={`binder-tab font-vhs text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap px-3 py-1.5 transition-all ${
                isActive ? 'binder-tab-active' : ''
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
