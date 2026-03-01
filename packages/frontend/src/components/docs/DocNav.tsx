import type { LucideIcon } from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  group: 'start' | 'ref';
}

const GROUPS = [
  { key: 'start', label: 'Getting Started' },
  { key: 'ref',   label: 'Reference'       },
] as const;

export function DocNav({
  sections,
  active,
  onNavigate,
}: {
  sections: NavSection[];
  active: string;
  onNavigate: (id: string) => void;
}) {
  return (
    <aside className="w-48 shrink-0 sticky top-0 self-start pt-10 pb-10 hidden lg:block">
      {GROUPS.map(({ key, label }) => {
        const items = sections.filter(s => s.group === key);
        return (
          <div key={key} className="mb-6">
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-600 mb-2 px-2">
              {label}
            </p>
            {items.map(({ id, label: itemLabel, icon: Icon }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  onClick={() => onNavigate(id)}
                  className={[
                    'relative w-full flex items-center gap-2 px-2 py-[7px] rounded text-left text-[12.5px] transition-all duration-100 mb-0.5',
                    isActive
                      ? 'text-[#FE7F2D] bg-[#FE7F2D]/8 font-medium'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/3',
                  ].join(' ')}
                >
                  {isActive && (
                    <span className="absolute left-0 inset-y-[20%] w-[2px] bg-[#FE7F2D] rounded-r-full" />
                  )}
                  <Icon size={12} className="shrink-0" />
                  {itemLabel}
                </button>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}