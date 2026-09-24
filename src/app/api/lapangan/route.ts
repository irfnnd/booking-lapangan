import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const defaultLapanganSeed = [
  {
    name: "Lapangan Futsal A",
    category: "Futsal",
    location: "Sintetis Indoor",
    price: 150000,
    description: "Lapangan futsal rumput sintetis standar internasional.",
    picture_url: "",
    status: "Tersedia",
  },
  {
    name: "Lapangan Badminton 1",
    category: "Badminton",
    location: "Karpet Vinyil Hall 1",
    price: 80000,
    description: "Lapangan bulutangkis karpet standar PBSI.",
    picture_url: "",
    status: "Tersedia",
  },
  {
    name: "Lapangan Basket Court",
    category: "Basketball",
    location: "Parquet Indoor",
    price: 200000,
    description: "Lapangan basket kayu lantai parquet.",
    picture_url: "",
    status: "Tersedia",
  },
];

const ensureAuthenticatedUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session;
};

export async function GET() {
  try {
    const lapangan = await prisma.lapangan.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (lapangan.length === 0) {
      await prisma.lapangan.createMany({
        data: defaultLapanganSeed,
      });

      const seededLapangan = await prisma.lapangan.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json(seededLapangan);
    }

    return NextResponse.json(lapangan);
  } catch (error) {
    console.error("GET /api/lapangan error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data lapangan" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const isAuthenticated = await ensureAuthenticatedUser();

    if (!isAuthenticated) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const lapangan = await prisma.lapangan.create({
      data: {
        name: body.name,
        category: body.category || "Futsal",
        location: body.location,
        price: Number(body.price),
        description: body.description || "",
        picture_url: body.picture_url || "",
        status:
          body.status === "Tersedia" || body.status === "Tidak Tersedia"
            ? body.status
            : "Tersedia",
      },
    });

    return NextResponse.json(lapangan, { status: 201 });
  } catch (error) {
    console.error("POST /api/lapangan error:", error);
    return NextResponse.json(
      { error: "Gagal menambah lapangan" },
      { status: 500 },
    );
  }
}