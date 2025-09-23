"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface YapScoreGaugeProps {
  score: number;
}

export function YapScoreGauge({ score }: YapScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const scoreOffset = circumference - (displayScore / 10) * circumference;

  useEffect(() => {
    const animation = requestAnimationFrame(() => setDisplayScore(score));
    return () => cancelAnimationFrame(animation);
  }, [score]);

  const getStrokeColor = () => {
    if (score < 4) return 'stroke-destructive';
    if (score < 7) return 'stroke-yellow-400';
    return 'stroke-accent';
  };

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg className="h-full w-full -rotate-90 transform">
        <circle
          className="stroke-muted"
          strokeWidth="10"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
        <circle
          className={cn('transition-all duration-1000 ease-out', getStrokeColor())}
          strokeWidth="10"
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: scoreOffset,
          }}
        />
      </svg>
      <span className="absolute text-5xl font-bold text-foreground">
        {score.toFixed(1)}
      </span>
    </div>
  );
}
