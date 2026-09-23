import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { isAdminUserEmail } from "@/lib/admin";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const isAdmin = await isAdminUserEmail(session.user.email);

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("GET /api/admin/session error:", error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
