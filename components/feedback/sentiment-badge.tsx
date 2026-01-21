"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SentimentBadgeProps {
  sentiment: string | null;
  confidence?: number | null;
  className?: string;
}

export function SentimentBadge({ sentiment, confidence, className }: SentimentBadgeProps) {
  if (!sentiment) return null;

  const config = {
    positive: {
      label: "Positive",
      variant: "default" as const,
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400",
    },
    neutral: {
      label: "Neutral",
      variant: "secondary" as const,
      className: "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400",
    },
    negative: {
      label: "Negative",
      variant: "destructive" as const,
      className: "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  const sentimentConfig = config[sentiment as keyof typeof config] || config.neutral;

  return (
    <Badge 
      variant={sentimentConfig.variant} 
      className={cn(sentimentConfig.className, "text-xs font-medium", className)}
      title={confidence ? `Confidence: ${Math.round(confidence * 100)}%` : undefined}
    >
      {sentimentConfig.label}
      {confidence && (
        <span className="ml-1 opacity-60">
          {Math.round(confidence * 100)}%
        </span>
      )}
    </Badge>
  );
}
