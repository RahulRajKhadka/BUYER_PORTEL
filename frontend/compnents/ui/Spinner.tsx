import { clsx } from 'clsx';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-10 w-10' };

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
  <div
    className={clsx(
      'animate-spin rounded-full border-2 border-stone-200 border-t-brand-600',
      sizes[size],
      className
    )}
  />
);