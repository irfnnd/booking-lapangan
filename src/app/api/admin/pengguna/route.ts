import { PrismaClient } from "@generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth-guard";
import { auth } from "@/lib/auth";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

export async function GET() {
  const authCheck = await requireAdminApi();

  if (!authCheck.authorized) {
    return NextResponse.json(
      {
        error:
          authCheck.status === 401
            ? "Anda harus login terlebih dahulu."
            : "Akses ditolak.",
      },
      {
        status: authCheck.status,
      }
    );
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.email,
      registeredAt: user.createdAt,
      role: user.role,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal mengambil data pengguna",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: NextRequest) {
  const authCheck = await requireAdminApi();

  if (!authCheck.authorized) {
    return NextResponse.json(
      {
        error:
          authCheck.status === 401
            ? "Anda harus login terlebih dahulu."
            : "Akses ditolak.",
      },
      {
        status: authCheck.status,
      }
    );
  }

  try {
    const body = await request.json();

    const {
      name,
      email,
      username,
      password,
      role,
    } = body;

    if (!email || !username || !password) {
      return NextResponse.json(
        {
          error: "Email, username, dan password wajib diisi.",
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

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingEmail) {
      return NextResponse.json(
        {
          error: "Email sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    const existingUsername = await prisma.customer.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername) {
      return NextResponse.json(
        {
          error: "Username sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    /*
     * Buat akun melalui Better Auth.
     *
     * Ini penting karena Better Auth yang akan membuat:
     *
     * User
     * Account
     * credential/password yang sudah di-hash
     *
     * sehingga akun bisa digunakan oleh signIn.email().
     */
    const result = await auth.api.signUpEmail({
      body: {
        name: name || username,
        email,
        password,
      },
    });

    if (!result?.user) {
      return NextResponse.json(
        {
          error: "Gagal membuat akun Better Auth.",
        },
        {
          status: 500,
        }
      );
    }

    /*
     * Better Auth membuat User terlebih dahulu.
     * Setelah itu kita sesuaikan role dan data Customer.
     */
    const user = await prisma.user.update({
      where: {
        id: result.user.id,
      },
      data: {
        name: name || username,
        role,
        updatedAt: new Date(),
      },
    });

    const customer = await prisma.customer.create({
      data: {
        userId: user.id,
        name: name || null,
        email,
        username,
        password,
      },
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        username: customer.username,
        registeredAt: user.createdAt,
        role: user.role,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("CREATE USER ERROR:", error);

    return NextResponse.json(
      {
        error: "Gagal menambahkan pengguna.",
      },
      {
        status: 500,
      }
    );
  }
}