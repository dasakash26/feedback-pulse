"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const prefix = "fp_";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + key;
}

async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export async function getProjects() {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { feedbacks: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function getProject(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: { 
      id,
      userId: session.user.id 
    },
    include: {
      _count: {
        select: { feedbacks: true },
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return project;
}

export async function createProject(name: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!name || name.trim().length === 0) {
    throw new Error("Project name is required");
  }

  const apiKey = generateApiKey();

  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      apiKey,
      userId: session.user.id,
    },
  });

  revalidatePath("/projects");
  return project;
}

export async function deleteProject(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/projects");
  return { success: true };
}

export async function regenerateApiKey(id: string) {
  const session = await getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const newApiKey = generateApiKey();

  const updated = await prisma.project.update({
    where: { id },
    data: { apiKey: newApiKey },
  });

  revalidatePath("/projects");
  revalidatePath(`/projects/${id}`);
  return updated;
}

