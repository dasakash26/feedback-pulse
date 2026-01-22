"use client";

import * as React from "react";
import { MoreVertical, Trash2, Tag, Bug, Lightbulb, HelpCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { SentimentBadge } from "./sentiment-badge";
import { deleteFeedback, updateFeedbackLabels } from "@/app/actions/feedback";
import { cn } from "@/lib/utils";

interface FeedbackItemProps {
  feedback: {
    id: string;
    content: string;
    rating: number;
    feedbackType: "BUG" | "FEATURE" | "OTHER";
    sentiment: "positive" | "neutral" | "negative" | null;
    sentimentScore: number | null;
    labels: string[];
    email: string | null;
    userAgent: string;
    createdAt: Date;
  };
}

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

export function FeedbackItem({ feedback }: FeedbackItemProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [editingLabels, setEditingLabels] = React.useState(false);
  const [labelInput, setLabelInput] = React.useState("");
  const [localLabels, setLocalLabels] = React.useState(feedback.labels);

  const typeInfo = typeConfig[feedback.feedbackType];
  const TypeIcon = typeInfo.icon;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteFeedback(feedback.id);
    } catch (error) {
      console.error("Failed to delete feedback:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAddLabel = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && labelInput.trim()) {
      const newLabels = [...localLabels, labelInput.trim()];
      setLocalLabels(newLabels);
      setLabelInput("");
      try {
        await updateFeedbackLabels(feedback.id, newLabels);
      } catch (error) {
        console.error("Failed to add label:", error);
        setLocalLabels(localLabels);
      }
    }
  };

  const handleRemoveLabel = async (label: string) => {
    const newLabels = localLabels.filter((l) => l !== label);
    setLocalLabels(newLabels);
    try {
      await updateFeedbackLabels(feedback.id, newLabels);
    } catch (error) {
      console.error("Failed to remove label:", error);
      setLocalLabels(localLabels);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
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
    <>
      <Card
        className={cn(
          "transition-all duration-200 cursor-pointer",
          expanded ? "ring-1 ring-primary/20" : "hover:shadow-sm hover:border-primary/10"
        )}
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary" className={cn("text-xs", typeInfo.className)}>
                  <TypeIcon className="mr-1 h-3 w-3" />
                  {typeInfo.label}
                </Badge>
                {renderStars(feedback.rating)}
                <SentimentBadge sentiment={feedback.sentiment} confidence={feedback.sentimentScore} />
                <span className="text-xs text-muted-foreground ml-auto">
                  {formatDate(feedback.createdAt)}
                </span>
              </div>

              <p className={cn(
                "text-sm text-foreground",
                !expanded && "line-clamp-2"
              )}>
                {feedback.content}
              </p>

              {expanded && (
                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                  {feedback.email && (
                    <p className="text-xs text-muted-foreground">
                      From: <span className="text-foreground">{feedback.email}</span>
                    </p>
                  )}
                  {feedback.userAgent && (
                    <p className="text-xs text-muted-foreground">
                      User Agent: <span className="text-foreground">{feedback.userAgent}</span>
                    </p>
                  )

                  }
                  <div className="flex items-center gap-2 flex-wrap">
                    {localLabels.map((label) => (
                      <Badge
                        key={label}
                        variant="outline"
                        className="text-xs cursor-pointer hover:bg-destructive/10 hover:border-destructive/20"
                        onClick={() => handleRemoveLabel(label)}
                      >
                        <Tag className="mr-1 h-2.5 w-2.5" />
                        {label}
                        <span className="ml-1 opacity-50">×</span>
                      </Badge>
                    ))}
                    {editingLabels ? (
                      <Input
                        className="h-6 w-32 text-xs"
                        placeholder="Add label..."
                        value={labelInput}
                        onChange={(e) => setLabelInput(e.target.value)}
                        onKeyDown={handleAddLabel}
                        onBlur={() => setEditingLabels(false)}
                        autoFocus
                      />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs text-muted-foreground"
                        onClick={() => setEditingLabels(true)}
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        Add Label
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t">
                  </div>
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
