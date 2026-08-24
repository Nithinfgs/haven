import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'profile';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ variant = 'card', count = 1 }) => {
  const items = Array.from({ length: count });

  if (variant === 'profile') {
    return (
      <div className="bg-surface-main border border-warm-200/50 rounded-3xl p-8 animate-pulse">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-warm-100 rounded-3xl shrink-0" />
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-warm-100 rounded-md w-1/3" />
            <div className="h-4 bg-warm-100 rounded-md w-1/4" />
            <div className="h-4 bg-warm-100 rounded-md w-1/2" />
          </div>
        </div>
        <div className="space-y-4 pt-6 border-t border-warm-100">
          <div className="h-4 bg-warm-100 rounded-md w-full" />
          <div className="h-4 bg-warm-100 rounded-md w-5/6" />
          <div className="h-4 bg-warm-100 rounded-md w-4/5" />
        </div>
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3 w-full">
        {items.map((_, i) => (
          <div key={i} className="bg-surface-main border border-warm-200/50 rounded-2xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-10 h-10 bg-warm-100 rounded-xl" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 bg-warm-100 rounded-md w-1/4" />
                <div className="h-3 bg-warm-100 rounded-md w-1/3" />
              </div>
            </div>
            <div className="w-16 h-8 bg-warm-100 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  // Default: 'card'
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {items.map((_, i) => (
        <div key={i} className="bg-surface-main border border-warm-200/50 rounded-3xl p-6 flex flex-col justify-between h-64 animate-pulse">
          <div>
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-12 h-12 bg-warm-100 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-warm-100 rounded-md w-3/4" />
                <div className="h-3 bg-warm-100 rounded-md w-1/2" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-warm-100 rounded-md w-full" />
              <div className="h-3 bg-warm-100 rounded-md w-5/6" />
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-6 pt-4 border-t border-warm-50">
            <div className="h-9 bg-warm-100 rounded-xl flex-1" />
            <div className="h-9 bg-warm-100 rounded-xl flex-1" />
          </div>
        </div>
      ))}
    </div>
  );
};
