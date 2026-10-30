"use client";

import { useState, useEffect } from "react";
import { calculateTimeRemaining, TimeRemaining } from "@/lib/formatters";

const INITIAL_REMAINING: TimeRemaining = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
  isEnded: false,
  isEndingSoon: false,
  formatted: "--:--:--",
};

export function useCountdown(endTime: string): TimeRemaining {
  const [remaining, setRemaining] = useState<TimeRemaining>(INITIAL_REMAINING);

  useEffect(() => {
    // Only calculate using real Date.now() on client mount
    setRemaining(calculateTimeRemaining(endTime));

    const timer = setInterval(() => {
      const updated = calculateTimeRemaining(endTime);
      setRemaining(updated);

      if (updated.isEnded) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return remaining;
}
