import type { LucideIcon } from 'lucide-react';
import { Button } from './Button.js';
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-stone-400" />
    </div>
    <h3 className="font-display text-xl font-semibold text-stone-700 mb-2">{title}</h3>
    <p className="text-stone-400 text-sm max-w-sm mb-6">{description}</p>
    {action && (
      <Button onClick={action.onClick}>{action.label}</Button>
    )}
  </div>
);