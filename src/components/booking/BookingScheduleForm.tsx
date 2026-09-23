import { CalendarDays, Clock3, LoaderCircle } from "lucide-react";
import type { FormEvent } from "react";

type BookingScheduleFormProps = {
  startTime: string;
  endTime: string;
  minDateTime: string;
  checking: boolean;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onCheckAvailability: (event: FormEvent<HTMLFormElement>) => void;
};

export default function BookingScheduleForm({
  startTime,
  endTime,
  minDateTime,
  checking,
  onStartTimeChange,
  onEndTimeChange,
  onCheckAvailability,
}: BookingScheduleFormProps) {
  return (
    <form onSubmit={onCheckAvailability} className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-800">Atur jadwal bermain</h2>
      <p className="mt-1 text-sm text-slate-500">
        Tentukan waktu mulai dan selesai untuk memeriksa ketersediaan.
      </p>

      <label className="mt-6 block text-sm font-semibold text-slate-700">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-emerald-600" />
          Waktu mulai
        </span>
        <input
          required
          type="datetime-local"
          min={minDateTime}
          value={startTime}
          onChange={(event) => onStartTimeChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>

      <label className="mt-4 block text-sm font-semibold text-slate-700">
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-emerald-600" />
          Waktu selesai
        </span>
        <input
          required
          type="datetime-local"
          min={startTime || minDateTime}
          value={endTime}
          onChange={(event) => onEndTimeChange(event.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </label>

      <button
        type="submit"
        disabled={checking}
        className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-600 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {checking && <LoaderCircle className="h-4 w-4 animate-spin" />}
        {checking ? "Memeriksa jadwal..." : "Cek ketersediaan"}
      </button>
    </form>
  );
}
