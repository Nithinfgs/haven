import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Heart, MessageSquare, Clock } from 'lucide-react';

export const Analytics: React.FC = () => {
  const metrics = [
    { label: 'Weekly Active Users', value: '1,420', change: '+12% vs last week', icon: TrendingUp },
    { label: 'Avg Session Duration', value: '24 mins', change: 'Stable', icon: Clock },
    { label: 'Session Rating Score', value: '4.8 / 5', change: '96% positive feedback', icon: Heart },
    { label: 'Total Messages Transmitted', value: '18.4K', change: '+8% vs last week', icon: MessageSquare },
  ];

  const charts = [
    { category: 'School Pressure', count: 32, percentage: '70%', color: 'bg-brand-primary' },
    { category: 'Friendships', count: 24, percentage: '55%', color: 'bg-brand-hover' },
    { category: 'General Venting', count: 18, percentage: '40%', color: 'bg-accent-teal' },
    { category: 'Stress & Anxiety', count: 42, percentage: '90%', color: 'bg-accent-teal-hover' },
    { category: 'Family Dynamics', count: 12, percentage: '28%', color: 'bg-accent-amber' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center space-x-2.5">
        <div className="p-2 bg-brand-light text-brand-primary rounded-xl border border-brand-primary/10">
          <BarChart3 size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Platform Analytics</h2>
          <p className="text-text-secondary text-xs mt-0.5">Understand user interactions, peak volume periods, and chat category frequencies.</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-wider">{m.label}</span>
                <span className="p-2 rounded-xl bg-surface-sec text-text-secondary">
                  <Icon size={14} />
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-text-primary mb-1">{m.value}</h3>
              <p className="text-[10px] text-text-secondary font-semibold">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Channel Volume charts */}
      <div className="bg-surface-main border border-border-primary rounded-2xl p-6 shadow-xs">
        <h4 className="font-bold text-text-primary text-sm mb-6">Popular Support Topics</h4>

        <div className="space-y-4">
          {charts.map((c) => (
            <div key={c.category} className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-text-secondary">
                <span>{c.category}</span>
                <span>{c.count} active sessions ({c.percentage})</span>
              </div>
              <div className="w-full bg-surface-sec h-3 rounded-full overflow-hidden border border-border-primary">
                <div className={`h-full ${c.color} rounded-full`} style={{ width: c.percentage }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
