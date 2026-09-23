import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const ensureAuthenticatedUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return !!session;
};

const defaultLapanganSeed = [
  {
    name: "Lapangan Futsal Vinyl A",
    category: "Futsal",
    location: "Gedung A - Lt. 1",
    price: 120000,
    picture_url:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500&auto=format&fit=crop&q=60",
    description: "Lantai interlock standar internasional, pencahayaan LED 400W.",
    status: "Tersedia",
  },
  {
    name: "Lapangan Badminton Synthetics 1",
    category: "Badminton",
    location: "Gedung B - Lt. 2",
    price: 80000,
    picture_url:
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&auto=format&fit=crop&q=60",
    description: "Karpet olahraga premium dengan AC hall dan area bersih.",
    status: "Tersedia",
  },
  {
    name: "Lapangan Basket Interlock B",
    category: "Basketball",
    location: "Gedung A - Lt. 2",
    price: 150000,
    picture_url:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&auto=format&fit=crop&q=60",
    description: "Ring basket hidrolik, papan skor digital, dan tribun penonton.",
    status: "Tersedia",
  },
  {
    name: "Lapangan Mini Soccer Sintetis",
    category: "Mini Soccer",
    location: "Outdoor Field 1",
    price: 250000,
    picture_url:
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=500&auto=format&fit=crop&q=60",
    description: "Rumput sintetis kualitas tinggi dengan jaring pengaman keliling.",
    status: "Tidak Tersedia",
  },
];

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