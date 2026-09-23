import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Silakan login terlebih dahulu untuk booking." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const lapanganId = body?.lapanganId;
    const selectedSlots = Array.isArray(body?.selectedSlots)
      ? body.selectedSlots
      : [];
    const bookingDate = body?.bookingDate || new Date().toISOString().slice(0, 10);

    if (!lapanganId) {
      return NextResponse.json(
        { error: "Lapangan tidak valid." },
        { status: 400 },
      );
    }

    if (selectedSlots.length === 0) {
      return NextResponse.json(
        { error: "Pilih minimal satu jam booking." },
        { status: 400 },
      );
    }

    const lapangan = await prisma.lapangan.findUnique({
      where: { id: lapanganId },
    });

    if (!lapangan) {
      return NextResponse.json(
        { error: "Lapangan tidak ditemukan." },
        { status: 404 },
      );
    }

    const safeUsernameBase = (
      session.user.name || session.user.email.split("@")[0] || "user"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "")
      .slice(0, 20);

    const customer = await prisma.customer.upsert({
      where: { email: session.user.email },
      update: {
        name: session.user.name || "Pengguna",
        picture_url: session.user.image || null,
      },
      create: {
        userId: session.user.id,
        email: session.user.email,
        name: session.user.name || "Pengguna",
        username: `${safeUsernameBase || "user"}${Date.now()}`,
        password: `booking-${Date.now()}`,
        picture_url: session.user.image || null,
      },
    });

    const customerId = customer.id;

    const createdBookings = await Promise.all(
      selectedSlots.map(async (slotLabel: string) => {
        const [startTimeLabel, endTimeLabel] = String(slotLabel).split(" - ");

        if (!startTimeLabel || !endTimeLabel) {
          return null;
        }

        const currentDate = new Date(`${bookingDate}T00:00:00`);

        const [startHour, startMinute] = startTimeLabel.split(":").map(Number);
        const [endHour, endMinute] = endTimeLabel.split(":").map(Number);

        const startTime = new Date(currentDate);
        startTime.setHours(startHour, startMinute, 0, 0);

        const endTime = new Date(currentDate);
        endTime.setHours(endHour, endMinute, 0, 0);

        return prisma.booking.create({
          data: {
            customerId,
            lapanganId: lapangan.id,
            startTime,
            endTime,
            status: "PENDING",
          },
        });
      }),
    );

    const validBookings = createdBookings.filter(Boolean);

    return NextResponse.json(
      {
        success: true,
        bookings: validBookings.length,
        data: validBookings,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/booking error:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan booking." },
      { status: 500 },
    );
  }
}
