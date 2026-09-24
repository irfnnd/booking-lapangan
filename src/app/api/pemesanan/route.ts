import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/app/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Silakan login terlebih dahulu." },
        { status: 401 },
      );
    }

    const bookings = await prisma.booking.findMany({
      where: {
        customer: {
          OR: [
            { email: session.user.email },
            { userId: session.user.id },
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        lapangan: true,
        payments: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    let totalAmount = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let cancelledCount = 0;

    for (const b of bookings) {
      if (b.status === "PENDING") pendingCount++;
      else if (b.status === "CONFIRMED") confirmedCount++;
      else if (b.status === "CANCELLED") cancelledCount++;

      const paidTotal = b.payments.reduce(
        (sum, p) => sum + (p.status === "PAID" ? p.amount : 0),
        0,
      );

      const durationHours = Math.max(
        1,
        Math.ceil(
          (new Date(b.endTime).getTime() - new Date(b.startTime).getTime()) /
            3600000,
        ),
      );

      totalAmount += paidTotal || durationHours * (b.lapangan?.price || 0);
    }

    return NextResponse.json({
      success: true,
      bookings,
      stats: {
        total: bookings.length,
        pending: pendingCount,
        confirmed: confirmedCount,
        cancelled: cancelledCount,
        totalAmount,
      },
    });
  } catch (error) {
    console.error("GET RIWAYAT PEMESANAN ERROR:", error);

    return NextResponse.json(
      { message: "Gagal memuat riwayat pemesanan." },
      { status: 500 },
    );
  }
}