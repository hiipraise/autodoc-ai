import type { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children:  ReactNode;
  className?: string;
  title?:    string;
  icon?:     ReactNode;
}

export function Card({ children, className, title, icon }: CardProps) {
  return (
    <div className={cn('bg-[#233D4D] border border-[#FE7F2D]/12 rounded-xl overflow-hidden', className)}>
      {(title || icon) && (
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#FE7F2D]/8 bg-[#FE7F2D]/3">
          {icon && <span className="text-[#FE7F2D]">{icon}</span>}
          {title && (
            <h3 className="text-[12px] font-semibold text-[#FE7F2D] tracking-wide uppercase">
              {title}
            </h3>
          )}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}