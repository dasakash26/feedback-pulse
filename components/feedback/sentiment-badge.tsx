"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
  sentiment: "positive" | "neutral" | "negative" | null;
  confidence?: number | null;
  className?: string;
}

export function SentimentBadge({ sentiment, confidence, className }: SentimentBadgeProps) {
  if (!sentiment) return null;

  const config: {
    [key: string]: {
      label: string;
      variant: "default" | "secondary" | "destructive";
      className: string;
    };
  } = {
    positive: {
      label: "Positive",
      variant: "default",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    neutral: {
      label: "Neutral",
      variant: "secondary",
      className: "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
    },
    negative: {
      label: "Negative",
      variant: "destructive",
      className: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const sentimentConfig = config[sentiment] || config.neutral;

  return (
    <Badge
      variant={sentimentConfig.variant}
      className={cn(sentimentConfig.className, "text-xs font-medium", className)}
      title={confidence ? `Confidence: ${(confidence * 100)}%` : `Confidence: ${0}%`}
    >
      {sentimentConfig.label}
      <span className="ml-1 opacity-60">
        {Math.round((confidence ?? 0) * 100)}%
      </span>
    </Badge>
  );
}
