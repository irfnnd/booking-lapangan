import React from "react";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | string;

interface BookingStatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

export default function BookingStatusBadge({
  status,
  size = "md",
}: BookingStatusBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-xs gap-1"
      : "px-2.5 py-1 text-xs font-medium gap-1.5";

  switch (normalizedStatus) {
    case "CONFIRMED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30 ${sizeClasses}`}
        >
          <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Confirmed
        </span>
      );
    case "CANCELLED":
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30 ${sizeClasses}`}
        >
          <XCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Cancelled
        </span>
      );
    case "PENDING":
    default:
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30 ${sizeClasses}`}
        >
          <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
          Pending
        </span>
      );
  }
}
