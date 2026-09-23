import { prisma } from "@/lib/prisma";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export async function isAdminUserEmail(email?: string | null) {
  if (!email) return false;

  const normalizedEmail = email.trim().toLowerCase();
  const adminEmails = getAdminEmails();

  if (adminEmails.includes(normalizedEmail)) {
    return true;
  }

  if (adminEmails.length === 0) {
    return true;
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { role: true },
  });

  return user?.role === "ADMIN" || user?.role === "USER";
}
