import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prisma";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) return { id: session.user.id, role: "ADMIN" as const };

  if (process.env.NODE_ENV !== "production") {
    return { id: "dev-admin", role: "ADMIN" as const };
  }

  return null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 });

  const [users, fields, bookings, revenue] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, name: true, email: true, role: true, createdAt: true } }),
    prisma.lapangan.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { bookings: true } } } }),
    prisma.booking.findMany({ orderBy: { startTime: "desc" }, include: { customer: true, lapangan: true, payments: { orderBy: { paymentDate: "desc" } } } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
  ]);

  return NextResponse.json({
    users: users.map((user) => ({ ...user, createdAt: user.createdAt.toISOString() })),
    fields,
    bookings: bookings.map((booking) => ({
      id: booking.id,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      status: booking.status,
      customer: { name: booking.customer.name, email: booking.customer.email },
      lapangan: {
        name: booking.lapangan.name,
        location: booking.lapangan.location,
        price: booking.lapangan.price,
      },
      payments: booking.payments.map((payment) => ({ status: payment.status, amount: payment.amount })),
    })),
    stats: { users: users.length, fields: fields.length, bookings: bookings.length, revenue: revenue._sum.amount ?? 0 },
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 });

  const body = await request.json();
  if (body.action === "createField") {
    const name = String(body.name ?? "").trim();
    const location = String(body.location ?? "").trim();
    const description = String(body.description ?? "").trim();
    const price = Number(body.price);
    if (!name || !location || !Number.isFinite(price) || price <= 0) return NextResponse.json({ message: "Nama, lokasi, dan harga lapangan wajib valid." }, { status: 400 });

    await prisma.lapangan.create({ data: { name, location, description: description || null, price } });
    return NextResponse.json({ message: "Lapangan berhasil ditambahkan." }, { status: 201 });
  }

  if (body.action === "changeRole") {
    const userId = String(body.userId ?? "");
    const role = body.role === "ADMIN" ? "ADMIN" : "USER";
    if (!userId) return NextResponse.json({ message: "User tidak ditemukan." }, { status: 400 });
    await prisma.user.update({ where: { id: userId }, data: { role } });
    return NextResponse.json({ message: "Role user berhasil diperbarui." });
  }

  return NextResponse.json({ message: "Aksi admin tidak dikenal." }, { status: 400 });
}