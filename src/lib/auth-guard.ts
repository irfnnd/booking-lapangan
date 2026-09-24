import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
}

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      user: null,
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      user,
    };
  }

  return {
    authorized: true,
    user,
  };
}

export async function requireAdminApi() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      authorized: false,
      status: 401,
      user: null,
    };
  }

  if (user.role !== "ADMIN") {
    return {
      authorized: false,
      status: 403,
      user,
    };
  }

  return {
    authorized: true,
    status: 200,
    user,
  };
}