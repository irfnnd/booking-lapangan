import { Clock3, ReceiptText } from "lucide-react";

type BookingPriceSummaryProps = {
  pricePerHour: number;
  durationHours: number;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export default function BookingPriceSummary({
  pricePerHour,
  durationHours,
}: BookingPriceSummaryProps) {
  const total = pricePerHour * durationHours;

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
        <ReceiptText className="h-4 w-4 text-emerald-600" />
        Ringkasan biaya
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4" />
          {formatMoney(pricePerHour)} x {durationHours} jam
        </span>
        <span className="font-semibold text-slate-700">{formatMoney(total)}</span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="font-bold text-slate-700">Total</span>
        <span className="text-xl font-bold text-emerald-600">{formatMoney(total)}</span>
      </div>
    </div>
  );
}
