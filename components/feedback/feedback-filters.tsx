"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FeedbackFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  counts?: {
    all: number;
    bug: number;
    feature: number;
    other: number;
  };
}

const filters = [
  { id: "ALL", label: "All" },
  { id: "BUG", label: "Bug" },
  { id: "FEATURE", label: "Feature" },
  { id: "OTHER", label: "Other" },
];

export function FeedbackFilters({ activeFilter, onFilterChange, counts }: FeedbackFiltersProps) {
  return (
    <div className="flex items-center gap-1 bg-muted p-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.id;
        const count = counts?.[filter.id.toLowerCase() as keyof typeof counts];
        
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={cn(
              "relative flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
            {count !== undefined && count > 0 && (
              <span
                className={cn(
                  "inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-medium",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
