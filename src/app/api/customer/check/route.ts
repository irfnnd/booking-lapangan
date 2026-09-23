import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json({ registered: false }, { status: 401 });
    }

    const customer = await prisma.customer.findUnique({
      where: { email: session.user.email },
    });

    return NextResponse.json({ registered: !!customer });
  } catch (error) {
    console.error("GET /api/customer/check error:", error);
    return NextResponse.json(
      { registered: false, error: "Gagal mengecek status customer." },
      { status: 500 },
    );
  }
}
