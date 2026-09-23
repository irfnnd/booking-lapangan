import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ensureAuthenticatedUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return false;
  }

  return true;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = await ensureAuthenticatedUser();

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const lapangan = await prisma.lapangan.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        location: body.location,
        price: Number(body.price),
        description: body.description,
        picture_url: body.picture_url,
        status: body.status,
      },
    });

    return NextResponse.json(lapangan);
  } catch (error) {
    console.error("PATCH /api/lapangan/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal mengubah lapangan" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const isAuthenticated = await ensureAuthenticatedUser();

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.lapangan.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/lapangan/[id] error:", error);
    return NextResponse.json(
      { error: "Gagal menghapus lapangan" },
      { status: 500 },
    );
  }
}
