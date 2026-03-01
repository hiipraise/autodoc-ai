import type { ReactNode } from 'react';

export function Step({
  n,
  title,
  last = false,
  children,
}: {
  n: number;
  title: string;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center shrink-0">
        <div className="w-7 h-7 rounded-full border border-[#FE7F2D]/60 bg-[#FE7F2D]/10 text-[#FE7F2D] text-[11px] font-bold font-mono flex items-center justify-center">
          {n}
        </div>
        {!last && <div className="w-px flex-1 bg-[#FE7F2D]/10 mt-2 min-h-[16px]" />}
      </div>
      <div className={`flex-1 ${last ? 'pb-0' : 'pb-7'}`}>
        <p className="text-[13px] font-semibold text-white mb-2">{title}</p>
        <div className="text-[13px] text-slate-400 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}