import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prisma";

async function currentCustomer() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;

  const customer = await prisma.customer.upsert({
    where: { userId: session.user.id },
    update: { name: session.user.name, email: session.user.email },
    create: {
      userId: session.user.id,
      name: session.user.name,
      email: session.user.email,
      username: `${session.user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, "-")}-${session.user.id.slice(0, 8)}`,
      password: "",
    },
  });

  return customer;
}

export async function GET() {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ message: "Sesi tidak ditemukan." }, { status: 401 });

  const [fields, bookings] = await Promise.all([
    prisma.lapangan.findMany({ orderBy: { name: "asc" } }),
    prisma.booking.findMany({
      where: { customerId: customer.id },
      include: { lapangan: true, payments: { orderBy: { paymentDate: "desc" } } },
      orderBy: { startTime: "desc" },
    }),
  ]);

  return NextResponse.json({
    fields,
    bookings: bookings.map((booking) => ({
      ...booking,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
      payments: booking.payments.map((payment) => ({ ...payment, paymentDate: payment.paymentDate.toISOString() })),
    })),
  });
}

export async function POST(request: Request) {
  const customer = await currentCustomer();
  if (!customer) return NextResponse.json({ message: "Sesi tidak ditemukan." }, { status: 401 });

  const body = await request.json();
  if (body.action === "checkAvailability") {
    const lapanganId = String(body.lapanganId ?? "");
    const startTime = new Date(String(body.startTime ?? ""));
    const endTime = new Date(String(body.endTime ?? ""));
    if (!lapanganId || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || startTime >= endTime || startTime < new Date()) return NextResponse.json({ message: "Tanggal dan jam booking tidak valid." }, { status: 400 });
    if (!(await prisma.lapangan.findUnique({ where: { id: lapanganId } }))) return NextResponse.json({ message: "Lapangan tidak ditemukan." }, { status: 404 });
    const conflict = await prisma.booking.findFirst({ where: { lapanganId, status: { not: "CANCELLED" }, startTime: { lt: endTime }, endTime: { gt: startTime } } });
    return NextResponse.json({ message: conflict ? "Jadwal tersebut sudah terisi." : "Jadwal tersedia. Silakan lanjutkan booking." }, { status: conflict ? 409 : 200 });
  }
  if (body.action === "pay") {
    const booking = await prisma.booking.findFirst({ where: { id: String(body.bookingId), customerId: customer.id }, include: { lapangan: true, payments: true } });
    if (!booking) return NextResponse.json({ message: "Booking tidak ditemukan." }, { status: 404 });
    if (booking.payments.some((payment) => payment.status === "PAID")) return NextResponse.json({ message: "Booking ini sudah dibayar." }, { status: 400 });
    const paymentType = ["BANK_TRANSFER", "E_WALLET", "CASH"].includes(String(body.paymentType)) ? String(body.paymentType) : "BANK_TRANSFER";

    const hours = Math.max(1, Math.ceil((booking.endTime.getTime() - booking.startTime.getTime()) / 3600000));
    await prisma.payment.create({ data: { bookingId: booking.id, amount: hours * booking.lapangan.price, status: "PAID", paymentDate: new Date(), paymentType, currency: "IDR" } });
    await prisma.booking.update({ where: { id: booking.id }, data: { status: "CONFIRMED" } });
    return NextResponse.json({ message: "Pembayaran berhasil dicatat." });
  }

  const lapanganId = String(body.lapanganId ?? "");
  const startTime = new Date(String(body.startTime ?? ""));
  const endTime = new Date(String(body.endTime ?? ""));
  if (!lapanganId || Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime()) || startTime >= endTime || startTime < new Date()) return NextResponse.json({ message: "Tanggal dan jam booking tidak valid." }, { status: 400 });
  if (!(await prisma.lapangan.findUnique({ where: { id: lapanganId } }))) return NextResponse.json({ message: "Lapangan tidak ditemukan." }, { status: 404 });

  const conflict = await prisma.booking.findFirst({ where: { lapanganId, status: { not: "CANCELLED" }, startTime: { lt: endTime }, endTime: { gt: startTime } } });
  if (conflict) return NextResponse.json({ message: "Jadwal tersebut sudah terisi." }, { status: 409 });
  await prisma.booking.create({ data: { customerId: customer.id, lapanganId, startTime, endTime } });
  return NextResponse.json({ message: "Booking berhasil dibuat." }, { status: 201 });
}