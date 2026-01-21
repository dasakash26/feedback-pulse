"use client";

import * as React from "react";
import Link from "next/link";
import { Copy, MoreVertical, Trash2, RefreshCw, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { deleteProject, regenerateApiKey } from "@/app/actions/projects";
import { generateEmbedScript } from "@/lib/embed";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    apiKey: string;
    createdAt: Date;
    _count: {
      feedbacks: number;
    };
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showEmbedCode, setShowEmbedCode] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isRegenerating, setIsRegenerating] = React.useState(false);
  const [copied, setCopied] = React.useState<"key" | "embed" | null>(null);

  const maskedKey = `${project.apiKey.slice(0, 7)}${"•".repeat(20)}${project.apiKey.slice(-4)}`;

  const handleCopyKey = async () => {
    await navigator.clipboard.writeText(project.apiKey);
    setCopied("key");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyEmbed = async () => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const embedCode = generateEmbedScript(project.apiKey, baseUrl);
    await navigator.clipboard.writeText(embedCode);
    setCopied("embed");
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProject(project.id);
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await regenerateApiKey(project.id);
    } catch (error) {
      console.error("Failed to regenerate API key:", error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold leading-none tracking-tight">
                <Link 
                  href={`/projects/${project.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {project.name}
                </Link>
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Created {formatDate(project.createdAt)}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleCopyKey}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy API Key
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowEmbedCode(!showEmbedCode)}>
                  <Code className="mr-2 h-4 w-4" />
                  {showEmbedCode ? "Hide" : "Show"} Embed Code
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRegenerate} disabled={isRegenerating}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${isRegenerating ? "animate-spin" : ""}`} />
                  Regenerate Key
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-mono text-xs">
              {project._count.feedbacks} feedback{project._count.feedbacks !== 1 ? "s" : ""}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-muted px-2 py-1.5 font-mono text-xs text-muted-foreground truncate">
                {maskedKey}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={handleCopyKey}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
            {copied === "key" && (
              <p className="text-xs text-green-600 dark:text-green-400">API key copied!</p>
            )}
          </div>

          {showEmbedCode && (
            <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Embed Script</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleCopyEmbed}
                >
                  <Copy className="mr-1.5 h-3 w-3" />
                  {copied === "embed" ? "Copied!" : "Copy"}
                </Button>
              </div>
              <pre className="bg-muted p-3 font-mono text-[10px] text-muted-foreground overflow-x-auto max-h-32">
                {generateEmbedScript(project.apiKey, typeof window !== "undefined" ? window.location.origin : "")}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
              All feedback associated with this project will be permanently deleted.
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
