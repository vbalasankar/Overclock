/**
 * Currency and Number Formatting Utilities for OVERCLOCK
 * Supports Indian Rupee (INR) representation per project requirements.
 */

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "₹0";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}k`;
  }
  return formatINR(amount);
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat("en-IN").format(val);
}

export function formatPercent(val: number): string {
  const prefix = val > 0 ? "+" : "";
  return `${prefix}${val.toFixed(1)}%`;
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(d);
  } catch {
    return isoString;
  }
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isEnded: boolean;
  isEndingSoon: boolean; // Less than 3 hours
  formatted: string;
}

export function calculateTimeRemaining(endTimeIso: string, currentTimestamp?: number): TimeRemaining {
  const end = new Date(endTimeIso).getTime();
  const now = currentTimestamp !== undefined ? currentTimestamp : Date.now();
  const diff = end - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isEnded: true,
      isEndingSoon: false,
      formatted: "Auction Ended",
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const isEndingSoon = totalSeconds <= 3 * 3600; // <= 3 hours

  let formatted = "";
  if (days > 0) {
    formatted = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    formatted = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    formatted = `${minutes}m ${seconds}s`;
  }

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isEnded: false,
    isEndingSoon,
    formatted,
  };
}
