import { PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      name,
      email,
      role,
    } = body;

    if (!email) {
      return NextResponse.json(
        {
          error: "Email wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (role !== "USER" && role !== "ADMIN") {
      return NextResponse.json(
        {
          error: "Role tidak valid.",
        },
        {
          status: 400,
        }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        {
          error: "Pengguna tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const duplicateEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: {
          id,
        },
      },
    });

    if (duplicateEmail) {
      return NextResponse.json(
        {
          error: "Email sudah digunakan pengguna lain.",
        },
        {
          status: 409,
        }
      );
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        name: name || existingUser.name,
        email,
        role,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.email,
      registeredAt: user.createdAt,
      role: user.role,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengubah pengguna.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Pengguna tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Pengguna berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal menghapus pengguna.",
      },
      {
        status: 500,
      }
    );
  }
}