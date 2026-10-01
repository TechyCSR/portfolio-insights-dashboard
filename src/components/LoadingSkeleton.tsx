"use client";

import { useEffect, useState } from "react";

const STEPS = [
  "Reading holdings from portfolio registry",
  "Fetching live quotes from Yahoo Finance",
  "Retrieving fundamentals from Google Finance",
  "Calculating portfolio valuation and sector metrics"
];

export function LoadingSkeleton() {
  const [progress, setProgress] = useState(15);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const jump = Math.floor(Math.random() * 12) + 5;
        const next = Math.min(prev + jump, 95);

        if (next < 35) {
          setCurrentStepIndex(0);
        } else if (next < 65) {
          setCurrentStepIndex(1);
        } else if (next < 85) {
          setCurrentStepIndex(2);
        } else {
          setCurrentStepIndex(3);
        }

        return next;
      });
    }, 400);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-[55vh] flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-7 max-w-md w-full shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
            Fetching portfolio data...
          </h3>
          <span className="text-xs font-mono font-semibold text-neutral-900 tabular-nums">
            {progress}%
          </span>
        </div>

        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden mb-5">
          <div
            className="bg-neutral-900 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="space-y-2.5">
          {STEPS.map((step, idx) => {
            const isDone = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step}
                className="flex items-center space-x-2.5 text-xs transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                  {isDone ? (
                    <span className="text-[11px] font-bold text-neutral-900">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                  )}
                </div>
                <span
                  className={
                    isDone
                      ? "text-neutral-500 font-medium line-through"
                      : isCurrent
                      ? "text-neutral-900 font-medium"
                      : "text-neutral-400 font-normal"
                  }
                >
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
