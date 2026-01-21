"use client";

import * as React from "react";
import { FeedbackItem } from "./feedback-item";
import { FeedbackFilters } from "./feedback-filters";
import { getFeedbackByProject } from "@/app/actions/feedback";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";

interface Feedback {
  id: string;
  content: string;
  rating: number;
  feedbackType: "BUG" | "FEATURE" | "OTHER";
  sentiment: string | null;
  sentimentScore: number | null;
  labels: string[];
  email: string | null;
  createdAt: Date;
}

interface FeedbackListProps {
  projectId: string;
  initialFeedbacks: Feedback[];
  initialTotal: number;
}

export function FeedbackList({ projectId, initialFeedbacks, initialTotal }: FeedbackListProps) {
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>(initialFeedbacks);
  const [total, setTotal] = React.useState(initialTotal);
  const [activeFilter, setActiveFilter] = React.useState("ALL");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFilterChange = async (filter: string) => {
    setActiveFilter(filter);
    setIsLoading(true);
    try {
      const result = await getFeedbackByProject({
        projectId,
        type: filter as "BUG" | "FEATURE" | "OTHER" | "ALL",
      });
      setFeedbacks(result.feedbacks as Feedback[]);
      setTotal(result.total);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (initialFeedbacks.length === 0 && activeFilter === "ALL") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No feedback yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Embed the widget on your site to start collecting feedback from users.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <FeedbackFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
        <p className="text-sm text-muted-foreground">
          {total} feedback{total !== 1 ? "s" : ""}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border bg-card p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No {activeFilter.toLowerCase()} feedback found.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedbacks.map((feedback) => (
            <FeedbackItem key={feedback.id} feedback={feedback} />
          ))}
        </div>
      )}
    </div>
  );
}
