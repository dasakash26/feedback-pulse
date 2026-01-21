"use client";

import * as React from "react";
import { Plus, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProject } from "@/app/actions/projects";
import { generateEmbedScript } from "@/lib/embed";

interface CreateProjectDialogProps {
  trigger?: React.ReactNode;
}

export function CreateProjectDialog({ trigger }: CreateProjectDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);
  const [createdProject, setCreatedProject] = React.useState<{
    id: string;
    name: string;
    apiKey: string;
  } | null>(null);
  const [copied, setCopied] = React.useState<"key" | "embed" | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsCreating(true);
    try {
      const project = await createProject(name);
      setCreatedProject(project);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handleCopy = async (type: "key" | "embed") => {
    if (!createdProject) return;
    
    const text = type === "key" 
      ? createdProject.apiKey 
      : generateEmbedScript(createdProject.apiKey, origin);
    
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setName("");
      setCreatedProject(null);
      setCopied(null);
    }, 200);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        {!createdProject ? (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>Create New Project</AlertDialogTitle>
              <AlertDialogDescription>
                Give your project a name to generate an embed code.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome App"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>
              <AlertDialogFooter>
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!name.trim() || isCreating}>
                  {isCreating ? "Creating..." : "Create Project"}
                </Button>
              </AlertDialogFooter>
            </form>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                </span>
                Project Created!
              </AlertDialogTitle>
              <AlertDialogDescription>
                Your project &quot;{createdProject.name}&quot; is ready. Add this code to your website to start collecting feedback.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Embed Code</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => handleCopy("embed")}
                  >
                    {copied === "embed" ? (
                      <>
                        <Check className="mr-1.5 h-3 w-3 text-green-600" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3 w-3" />
                        Copy Code
                      </>
                    )}
                  </Button>
                </div>
                <div className="relative">
                  <pre className="border bg-muted p-4 font-mono text-[10px] text-muted-foreground overflow-x-auto whitespace-pre-wrap break-all">
                    {generateEmbedScript(createdProject.apiKey, origin)}
                  </pre>
                </div>
              </div>
              
              <div className="border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-medium">Project Key</Label>
                    <p className="text-[10px] text-muted-foreground">Unique identifier for this project</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-muted px-2 py-1 font-mono text-[10px]">
                      {createdProject.apiKey}
                    </code>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleCopy("key")}
                    >
                      {copied === "key" ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <AlertDialogFooter>
              <Button onClick={handleClose} className="w-full">Done</Button>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
