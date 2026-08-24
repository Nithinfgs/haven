import React from 'react';
import { HelpCircle } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <HelpCircle size={32} className="text-text-muted" />,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-surface-main border border-dashed border-border-primary rounded-2xl min-h-[300px]">
      <div className="mb-4">
        {icon}
      </div>
      <h4 className="text-base font-bold text-text-primary mb-1">{title}</h4>
      <p className="text-text-secondary text-xs max-w-sm mb-6 leading-relaxed">{description}</p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center h-10 px-5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-[10px] active:bg-brand-pressed transition-colors shadow-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
