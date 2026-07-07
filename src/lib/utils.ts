import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, maximumFractionDigits = 2) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits
  }).format(value);
}

export function formatCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

export function formatPercent(value: number, maximumFractionDigits = 2) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(maximumFractionDigits)}%`;
}

export function numericPercent(value: number, maximumFractionDigits = 2) {
  return `${value.toFixed(maximumFractionDigits)}%`;
}

export function getChangeClass(value: number) {
  if (value > 0) return "text-success";
  if (value < 0) return "text-danger";
  return "text-muted";
}

export function getSignalClass(value: number) {
  if (value >= 65) return "text-success";
  if (value <= 35) return "text-danger";
  return "text-primary";
}

export function rowsToCsv<T extends Record<string, unknown>>(rows: T[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const body = rows.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        return `"${String(value ?? "").replaceAll('"', '""')}"`;
      })
      .join(",")
  );
  return [headers.join(","), ...body].join("\n");
}
