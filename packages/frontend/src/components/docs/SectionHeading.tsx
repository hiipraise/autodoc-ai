import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionHeading({
  icon: Icon,
  label,
  title,
  subtitle,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={12} className="text-[#FE7F2D]" />
        <span className="text-[10px] tracking-[0.15em] uppercase font-semibold text-[#FE7F2D]/80">
          {label}
        </span>
      </div>
      <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">{title}</h2>
      {subtitle && (
        <p className="text-[13px] text-slate-400 leading-relaxed max-w-lg">{subtitle}</p>
      )}
    </div>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[13px] font-semibold text-white mt-7 mb-3 flex items-center gap-2">
      <span className="w-4 h-px bg-[#FE7F2D]/40 shrink-0" />
      {children}
    </h3>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <p className="text-[13px] text-slate-400 leading-relaxed mb-4 [&_code]:bg-[#FE7F2D]/10 [&_code]:text-[#FE7F2D] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:font-mono [&_code]:text-[11.5px] [&_a]:text-[#FE7F2D] [&_a]:no-underline hover:[&_a]:underline [&_strong]:text-slate-200 [&_strong]:font-semibold">
      {children}
    </p>
  );
}