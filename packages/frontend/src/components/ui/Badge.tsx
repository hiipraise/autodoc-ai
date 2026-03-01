import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'pumpkin' | 'green' | 'blue' | 'purple' | 'gray';
  className?: string;
}

export function Badge({ children, variant = 'pumpkin', className }: BadgeProps) {
  const variants = {
    pumpkin: 'bg-[#FE7F2D]/15 text-[#FE7F2D] border-[#FE7F2D]/30',
    green:   'bg-green-400/15 text-green-400 border-green-400/30',
    blue:    'bg-blue-400/15 text-blue-400 border-blue-400/30',
    purple:  'bg-purple-400/15 text-purple-400 border-purple-400/30',
    gray:    'bg-gray-400/15 text-gray-400 border-gray-400/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}