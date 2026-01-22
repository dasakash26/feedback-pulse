import { Suspense } from "react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentFeedback } from "@/components/dashboard/recent-feedback";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getDashboardStats } from "@/app/actions/feedback";
import { FolderOpen, MessageSquare, TrendingUp, Plus } from "lucide-react";
import Link from "next/link";

async function DashboardStats() {
  const stats = await getDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatsCard
        title="Total Projects"
        value={stats.projectCount}
        description="Active feedback projects"
        icon={FolderOpen}
      />
      <StatsCard
        title="Total Feedback"
        value={stats.feedbackCount}
        description="All time submissions"
        icon={MessageSquare}
      />
      <StatsCard
        title="This Week"
        value={stats.recentFeedbackCount}
        description="Feedback in last 7 days"
        icon={TrendingUp}
      />
    </div>
  );
}

function DashboardStatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border bg-card p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-11 w-11 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentFeedbackSkeleton() {
  return (
    <div className="border bg-card p-6 space-y-4">
      <Skeleton className="h-6 w-36" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-lg bg-muted/30">
            <div className="flex-1 space-y-2">
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto px-4">
          <ModeToggle />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your feedback collection
            </p>
          </div>
          <Link href="/projects">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <Suspense fallback={<DashboardStatsSkeleton />}>
          <DashboardStats />
        </Suspense>

        <Suspense fallback={<RecentFeedbackSkeleton />}>
          <RecentFeedback />
        </Suspense>
      </div>
    </>
  );
}
