import { Info, Lightbulb, AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';

type CalloutVariant = 'info' | 'tip' | 'warning';

const variants: Record<CalloutVariant, { icon: typeof Info; base: string; icon_color: string }> = {
  info:    { icon: Info,           base: 'border-sky-500/20 bg-sky-500/5 text-sky-300',      icon_color: 'text-sky-400'    },
  tip:     { icon: Lightbulb,      base: 'border-[#FE7F2D]/20 bg-[#FE7F2D]/5 text-amber-200', icon_color: 'text-[#FE7F2D]' },
  warning: { icon: AlertTriangle,  base: 'border-amber-500/20 bg-amber-500/5 text-amber-200', icon_color: 'text-amber-400'  },
};

export function Callout({ type = 'info', children }: { type?: CalloutVariant; children: ReactNode }) {
  const { icon: Icon, base, icon_color } = variants[type];
  return (
    <div className={`flex gap-3 items-start border rounded-lg px-4 py-3 my-3 text-[13px] leading-relaxed ${base}`}>
      <Icon size={14} className={`mt-0.5 shrink-0 ${icon_color}`} />
      <div className="[&_code]:bg-black/20 [&_code]:px-1 [&_code]:rounded [&_code]:font-mono [&_code]:text-[12px] [&_strong]:font-semibold">
        {children}
      </div>
    </div>
  );
}