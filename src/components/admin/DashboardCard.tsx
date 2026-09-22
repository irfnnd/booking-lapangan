import React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  colorScheme?: "emerald" | "blue" | "amber" | "purple" | "rose";
  className?: string;
}

const colorMap = {
  emerald: {
    bgIcon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    border: "hover:border-emerald-200 dark:hover:border-emerald-800",
  },
  blue: {
    bgIcon: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    border: "hover:border-blue-200 dark:hover:border-blue-800",
  },
  amber: {
    bgIcon: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    border: "hover:border-amber-200 dark:hover:border-amber-800",
  },
  purple: {
    bgIcon: "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
    border: "hover:border-purple-200 dark:hover:border-purple-800",
  },
  rose: {
    bgIcon: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    border: "hover:border-rose-200 dark:hover:border-rose-800",
  },
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  subtitle,
  trend,
  colorScheme = "emerald",
  className = "",
}: DashboardCardProps) {
  const colors = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 ${colors.border} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`rounded-xl p-3 transition-transform duration-200 group-hover:scale-110 ${colors.bgIcon}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>

      {(trend || subtitle) && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800/80">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 font-semibold ${
                trend.isPositive !== false
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {trend.isPositive !== false ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </span>
          )}

          {subtitle && (
            <span className="text-gray-400 dark:text-gray-500">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
