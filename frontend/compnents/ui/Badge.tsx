
import clsx from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'red' | 'yellow' | 'blue' | 'stone';
  className?: string;
}

const variants = {
  green: 'bg-brand-100 text-brand-700',
  red: 'bg-red-100 text-red-700',
  yellow: 'bg-amber-100 text-amber-700',
  blue: 'bg-blue-100 text-blue-700',
  stone: 'bg-stone-100 text-stone-600',
};

export const Badge = ({ children, variant = 'stone', className }: BadgeProps) => (
  <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', variants[variant], className)}>
    {children}
  </span>
);