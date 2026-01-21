"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

type FeedbackTypeFilter = "BUG" | "FEATURE" | "OTHER" | "ALL";

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

interface GetFeedbackOptions {
  projectId: string;
  type?: FeedbackTypeFilter;
  label?: string;
  limit?: number;
  offset?: number;
}

export async function getFeedbackByProject({
  projectId,
  type = "ALL",
  label,
  limit = 50,
  offset = 0,
}: GetFeedbackOptions) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: session.user.id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const where: Record<string, unknown> = {
    projectId,
  };

  if (type !== "ALL") {
    where.feedbackType = type;
  }

  if (label) {
    where.labels = { has: label };
  }

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.feedback.count({ where }),
  ]);

  return { feedbacks, total };
}

export async function getRecentFeedback(limit = 5) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const feedbacks = await prisma.feedback.findMany({
    where: {
      project: {
        userId: session.user.id,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return feedbacks;
}

export async function updateFeedbackLabels(feedbackId: string, labels: string[]) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId },
    include: { project: true },
  });

  if (!feedback || feedback.project?.userId !== session.user.id) {
    throw new Error("Feedback not found");
  }

  const updated = await prisma.feedback.update({
    where: { id: feedbackId },
    data: { labels },
  });

  revalidatePath(`/projects/${feedback.projectId}`);
  return updated;
}

export async function deleteFeedback(feedbackId: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Verify feedback ownership through project
  const feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId },
    include: { project: true },
  });

  if (!feedback || feedback.project?.userId !== session.user.id) {
    throw new Error("Feedback not found");
  }

  await prisma.feedback.delete({
    where: { id: feedbackId },
  });

  revalidatePath(`/projects/${feedback.projectId}`);
  return { success: true };
}

export async function getDashboardStats() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const [projectCount, feedbackCount, recentFeedbackCount] = await Promise.all([
    prisma.project.count({
      where: { userId: session.user.id },
    }),
    prisma.feedback.count({
      where: {
        project: { userId: session.user.id },
      },
    }),
    prisma.feedback.count({
      where: {
        project: { userId: session.user.id },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    }),
  ]);

  return {
    projectCount,
    feedbackCount,
    recentFeedbackCount,
  };
}
