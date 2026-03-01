import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 ' +
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#233D4D] ' +
      'disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:   'bg-[#FE7F2D] hover:bg-[#e56510] text-white focus:ring-[#FE7F2D]',
      secondary: 'bg-[#2e4f63] hover:bg-[#3a6278] text-white border border-[#FE7F2D]/20 focus:ring-[#FE7F2D]',
      ghost:     'bg-transparent hover:bg-[#FE7F2D]/10 text-[#FE7F2D] border border-[#FE7F2D]/30 focus:ring-[#FE7F2D]',
      danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-3 text-base gap-2',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';