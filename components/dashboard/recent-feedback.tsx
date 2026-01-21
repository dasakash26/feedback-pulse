import { getRecentFeedback } from "@/app/actions/feedback";
import { Badge } from "@/components/ui/badge";
import { Bug, Lightbulb, HelpCircle, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const typeConfig = {
  BUG: {
    icon: Bug,
    label: "Bug",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  FEATURE: {
    icon: Lightbulb,
    label: "Feature",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  OTHER: {
    icon: HelpCircle,
    label: "Other",
    className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  },
};

export async function RecentFeedback() {
  const feedbacks = await getRecentFeedback(50);

  if (feedbacks.length === 0) {
    return (
      <div className="border bg-card p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Feedback</h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No feedback received yet. Embed the widget to start collecting feedback.
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    return `${days}d ago`;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border bg-card">
      <div className="flex items-center justify-between p-6 pb-4">
        <h3 className="text-lg font-semibold">Recent Feedback</h3>
        <Link 
          href="/projects" 
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div className="divide-y">
        {feedbacks.map((feedback) => {
          const typeInfo = typeConfig[feedback.feedbackType];
          const TypeIcon = typeInfo.icon;

          return (
            <Link
              key={feedback.id}
              href={`/projects/${feedback.projectId}`}
              className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className={cn("text-xs", typeInfo.className)}>
                    <TypeIcon className="mr-1 h-3 w-3" />
                    {typeInfo.label}
                  </Badge>
                  {renderStars(feedback.rating)}
                  <span className="text-xs text-muted-foreground">
                    {formatDate(feedback.createdAt)}
                  </span>
                </div>
                <p className="text-sm line-clamp-1">{feedback.content}</p>
                <p className="text-xs text-muted-foreground">
                  {feedback.project?.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
