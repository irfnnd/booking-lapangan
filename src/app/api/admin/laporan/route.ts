import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";
import { prisma } from "@/app/prisma";

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

function getPeriodRange(period: string): { start: Date; end: Date; prevStart: Date; prevEnd: Date } {
  const now = new Date();
  let start: Date;
  let end: Date = new Date(now);
  let prevStart: Date;
  let prevEnd: Date;

  switch (period) {
    case "today":
      start = new Date(now);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 1);
      prevEnd = new Date(start);
      prevEnd.setMilliseconds(-1);
      break;
    case "week":
      start = new Date(now);
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      prevStart = new Date(start);
      prevStart.setDate(prevStart.getDate() - 7);
      prevEnd = new Date(start);
      prevEnd.setMilliseconds(-1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      prevStart = new Date(now.getFullYear() - 1, 0, 1, 0, 0, 0, 0);
      prevEnd = new Date(now.getFullYear(), 0, 1, 0, 0, 0, -1);
      break;
    case "month":
    default:
      start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      prevStart = new Date(now.getFullYear(), now.getMonth() - 1, 1, 0, 0, 0, 0);
      prevEnd = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, -1);
      break;
  }

  return { start, end, prevStart, prevEnd };
}

export async function GET(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Akses admin diperlukan." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") ?? "month";
  const type = searchParams.get("type") ?? "all"; // "summary" | "transactions" | "chart" | "all"

  const { start, end, prevStart, prevEnd } = getPeriodRange(period);

  // ── Transactions (ReportTable) ────────────────────────────────────────────
  if (type === "transactions" || type === "all") {
    const bookings = await prisma.booking.findMany({
      where: { startTime: { gte: start, lte: end }, status: "CONFIRMED" },
      orderBy: { startTime: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        lapangan: { select: { name: true, category: true, price: true } },
        payments: {
          orderBy: { paymentDate: "desc" },
          take: 1,
          select: { amount: true, status: true, paymentType: true, bank: true },
        },
      },
    });

    const transactions = bookings.map((b) => {
      const payment = b.payments[0];
      const startHour = b.startTime.getHours().toString().padStart(2, "0");
      const startMin = b.startTime.getMinutes().toString().padStart(2, "0");
      const endHour = b.endTime.getHours().toString().padStart(2, "0");
      const endMin = b.endTime.getMinutes().toString().padStart(2, "0");

      const dateStr = b.startTime.toISOString().slice(0, 10);
      const timeSlot = `${startHour}:${startMin} - ${endHour}:${endMin}`;

      // Build a readable payment method label
      let paymentMethod = "—";
      if (payment) {
        if (payment.paymentType === "qris") paymentMethod = "QRIS";
        else if (payment.paymentType === "bank_transfer" && payment.bank) {
          paymentMethod = `Transfer Bank ${payment.bank.toUpperCase()}`;
        } else if (payment.paymentType === "credit_card") paymentMethod = "Kartu Kredit";
        else if (payment.paymentType === "echannel") paymentMethod = "Mandiri Bill Payment";
        else if (payment.paymentType) paymentMethod = payment.paymentType;
      }

      // Generate a human-readable booking code from the UUID
      const shortId = b.id.replace(/-/g, "").slice(0, 8).toUpperCase();
      const bookingCode = `BK-${b.startTime.getFullYear()}-${shortId}`;

      // Hitung durasi sesi dalam jam sebagai fallback
      const durationHours =
        (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * 60);
      const priceFromLapangan = Math.round(b.lapangan.price * durationHours);

      // Gunakan jumlah payment jika ada dan > 0, jika tidak gunakan harga lapangan × durasi
      const paymentAmount =
        payment && payment.amount > 0 ? payment.amount : priceFromLapangan;

      return {
        id: b.id,
        bookingCode,
        customerName: b.customer.name ?? "—",
        customerEmail: b.customer.email,
        lapanganName: b.lapangan.name,
        category: b.lapangan.category,
        date: dateStr,
        timeSlot,
        amount: paymentAmount,
        paymentMethod,
        status: b.status as "CONFIRMED" | "PENDING" | "CANCELLED",
      };
    });

    if (type === "transactions") {
      return NextResponse.json({ transactions });
    }

    // ── Summary ────────────────────────────────────────────────────────────
    const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED");

    // Gunakan fallback harga lapangan × durasi jika payment tidak ada / 0
    const totalRevenue = confirmedBookings.reduce((acc, b) => {
      const pay = b.payments[0];
      if (pay && pay.amount > 0) return acc + pay.amount;
      const durationHours =
        (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * 60);
      return acc + Math.round(b.lapangan.price * durationHours);
    }, 0);

    const totalBookings = bookings.length;

    // Previous period for growth calculation
    const prevBookings = await prisma.booking.findMany({
      where: { startTime: { gte: prevStart, lte: prevEnd }, status: "CONFIRMED" },
      include: {
        lapangan: { select: { price: true } },
        payments: { take: 1, select: { amount: true } },
      },
    });
    const prevRevenue = prevBookings.reduce((acc, b) => {
      const pay = b.payments[0];
      if (pay && pay.amount > 0) return acc + pay.amount;
      const durationHours =
        (b.endTime.getTime() - b.startTime.getTime()) / (1000 * 60 * 60);
      return acc + Math.round(b.lapangan.price * durationHours);
    }, 0);

    let revenueGrowth = "0%";
    let isGrowthPositive = true;
    if (prevRevenue > 0) {
      const pct = ((totalRevenue - prevRevenue) / prevRevenue) * 100;
      isGrowthPositive = pct >= 0;
      revenueGrowth = `${isGrowthPositive ? "+" : ""}${pct.toFixed(1)}%`;
    } else if (totalRevenue > 0) {
      revenueGrowth = "+100%";
      isGrowthPositive = true;
    }

    // Growth for bookings count
    const prevBookingsCount = prevBookings.length;
    let bookingGrowth = "0%";
    let isBookingGrowthPositive = true;
    if (prevBookingsCount > 0) {
      const pct = ((totalBookings - prevBookingsCount) / prevBookingsCount) * 100;
      isBookingGrowthPositive = pct >= 0;
      bookingGrowth = `${isBookingGrowthPositive ? "+" : ""}${pct.toFixed(1)}%`;
    } else if (totalBookings > 0) {
      bookingGrowth = "+100%";
    }


    // ── Weekly Chart (last 7 days) ─────────────────────────────────────────
    const chartStart = new Date();
    chartStart.setDate(chartStart.getDate() - 6);
    chartStart.setHours(0, 0, 0, 0);

    const chartBookings = await prisma.booking.findMany({
      where: { startTime: { gte: chartStart }, status: "CONFIRMED" },
      include: { payments: { take: 1, select: { amount: true, paymentDate: true } } },
    });

    const dayLabels = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dailyMap: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const b of chartBookings) {
      const key = b.startTime.toISOString().slice(0, 10);
      if (key in dailyMap) {
        dailyMap[key] += b.payments[0]?.amount ?? 0;
      }
    }

    const rawAmounts = Object.values(dailyMap);
    const maxAmount = Math.max(...rawAmounts, 1);
    const weeklyChart = Object.entries(dailyMap).map(([dateStr, amount]) => {
      const d = new Date(dateStr + "T12:00:00");
      return {
        day: dayLabels[d.getDay()],
        amount,
        heightPercent: Math.round((amount / maxAmount) * 100),
      };
    });

    // Category occupancy (booking count per category, normalized)
    const catBookings = await prisma.booking.findMany({
      where: { startTime: { gte: chartStart } },
      include: { lapangan: { select: { category: true } } },
    });
    const catCount: Record<string, number> = {};
    for (const b of catBookings) {
      const cat = b.lapangan.category || "Lainnya";
      catCount[cat] = (catCount[cat] ?? 0) + 1;
    }
    const maxCat = Math.max(...Object.values(catCount), 1);
    const colors: Record<string, string> = {
      Futsal: "bg-lime-400",
      Badminton: "bg-emerald-400",
      Basketball: "bg-blue-400",
      "Mini Soccer": "bg-purple-400",
      Tenis: "bg-amber-400",
    };
    const categoryUsage = Object.entries(catCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / maxCat) * 100),
        color: colors[name] ?? "bg-gray-400",
      }));

    const topCategory = categoryUsage[0]?.name ?? "—";
    const topCategoryPercent = categoryUsage[0]?.percent ?? 0;

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalBookings,
        revenueGrowth,
        isGrowthPositive,
        bookingGrowth,
        isBookingGrowthPositive,
      },
      transactions,
      chart: {
        weeklyData: weeklyChart,
        totalWeekly: rawAmounts.reduce((a, b) => a + b, 0),
        categoryUsage,
        topCategory,
        topCategoryPercent,
      },
    });
  }

  return NextResponse.json({ message: "Invalid type" }, { status: 400 });
}
