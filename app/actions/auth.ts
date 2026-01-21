"use server";
import { auth } from "@/lib/auth";

export const getSession = async () => {
  try {
    const session = await auth.api.getSession({
      headers: new Headers(),
    });
    return session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};
