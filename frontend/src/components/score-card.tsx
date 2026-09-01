'use client';

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScoreCardProps {
  label: string;
  score: number;
  icon: LucideIcon;
  color: 'blue' | 'green' | 'purple' | 'amber';
}

const colorMap = {
  blue: {
    ring: 'stroke-blue-500',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  green: {
    ring: 'stroke-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  purple: {
    ring: 'stroke-violet-500',
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10',
    iconBg: 'bg-violet-100 dark:bg-violet-900/30',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
  amber: {
    ring: 'stroke-amber-500',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
} as const;

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
}

export default function ScoreCard({ label, score, icon: Icon, color }: ScoreCardProps) {
  const colors = colorMap[color];
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={cn('relative flex items-center justify-center rounded-2xl p-3', colors.bg)}>
        <Icon className={cn('w-5 h-5', colors.iconColor)} />
      </div>
      <div className="relative w-24 h-24 sm:w-28 sm:h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/50"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(colors.ring, 'transition-all duration-700 ease-out')}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-xl sm:text-2xl font-bold tabular-nums', colors.text)}>
            {score}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{getScoreLabel(score)}</p>
      </div>
    </div>
  );
}
