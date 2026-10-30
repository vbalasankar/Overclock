"use client";

import React from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { Clock, Flame, AlertCircle } from "lucide-react";

interface CountdownBadgeProps {
  endTime: string;
  compact?: boolean;
  showIcon?: boolean;
}

export function CountdownBadge({
  endTime,
  compact = false,
  showIcon = true,
}: CountdownBadgeProps) {
  const { isEnded, isEndingSoon, formatted, days, hours, minutes, seconds } =
    useCountdown(endTime);

  if (isEnded) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#151919] border border-[#29302A] text-xs font-mono text-[#68716B]">
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-[#68716B]" />}
        <span>Ended</span>
      </span>
    );
  }

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm text-xs font-mono font-medium transition-colors ${
          isEndingSoon
            ? "bg-[#FACC15]/10 border border-[#FACC15]/40 text-[#FACC15] animate-pulse"
            : "bg-[#1B2020] border border-[#29302A] text-[#9DFF3F]"
        }`}
      >
        {showIcon &&
          (isEndingSoon ? (
            <Flame className="w-3.5 h-3.5 text-[#FACC15]" />
          ) : (
            <Clock className="w-3.5 h-3.5 text-[#C6FF00]" />
          ))}
        <span>{formatted}</span>
      </span>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all ${
        isEndingSoon
          ? "bg-[#1B2020] border-[#FACC15]/50 shadow-[0_0_15px_-3px_rgba(250,204,21,0.2)]"
          : "bg-[#151919] border-[#29302A]"
      }`}
    >
      {showIcon && (
        <span className="relative flex h-2 w-2">
          {isEndingSoon && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FACC15] opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isEndingSoon ? "bg-[#FACC15]" : "bg-[#C6FF00]"
            }`}
          ></span>
        </span>
      )}
      <div className="flex items-center gap-1 font-mono text-xs text-[#F5F7F2]">
        {days > 0 && (
          <>
            <span className="font-bold text-[#C6FF00]">{days}</span>
            <span className="text-[#68716B] text-[10px] mr-1">D</span>
          </>
        )}
        <span className="font-bold text-[#F5F7F2]">
          {hours.toString().padStart(2, "0")}
        </span>
        <span className="text-[#68716B] text-[10px] mr-0.5">:</span>
        <span className="font-bold text-[#F5F7F2]">
          {minutes.toString().padStart(2, "0")}
        </span>
        <span className="text-[#68716B] text-[10px] mr-0.5">:</span>
        <span
          className={`font-bold ${
            isEndingSoon ? "text-[#FACC15]" : "text-[#9DFF3F]"
          }`}
        >
          {seconds.toString().padStart(2, "0")}
        </span>
      </div>
      {isEndingSoon && (
        <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-[#FACC15] bg-[#FACC15]/10 px-1 py-0.5 rounded">
          Soon
        </span>
      )}
    </div>
  );
}

