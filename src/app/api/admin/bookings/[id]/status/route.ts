import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ALLOWED_STATUS = [
  "PENDING",
  "CONFIRMED",
  "CANCELLED",
] as const;

type BookingStatus = (typeof ALLOWED_STATUS)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    console.log("=================================");
    console.log("PATCH UPDATE BOOKING");
    console.log("BOOKING ID:", id);

    const body = await request.json();

    console.log("REQUEST BODY:", body);

    const status = body.status as BookingStatus;

    if (!ALLOWED_STATUS.includes(status)) {
      console.log("STATUS TIDAK VALID:", status);

      return NextResponse.json(
        {
          success: false,
          message: `Status "${status}" tidak valid.`,
        },
        { status: 400 },
      );
    }

    const booking = await prisma.booking.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        status: true,
      },
    });

    console.log("HASIL CARI BOOKING:", booking);

    if (!booking) {
      console.log("BOOKING TIDAK DITEMUKAN!");

      return NextResponse.json(
        {
          success: false,
          message: `Booking dengan ID ${id} tidak ditemukan di database.`,
        },
        { status: 404 },
      );
    }

    console.log("BOOKING DITEMUKAN");
    console.log("STATUS LAMA:", booking.status);
    console.log("STATUS BARU:", status);

    const updatedBooking = await prisma.booking.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });

    console.log("BOOKING BERHASIL DIUPDATE:", updatedBooking);
    console.log("=================================");

    return NextResponse.json({
      success: true,
      message: "Status booking berhasil diperbarui.",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("UPDATE BOOKING STATUS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal mengubah status booking.",
      },
      { status: 500 },
    );
  }
}