"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WIZARD_STEPS } from "./wizard-config";

interface StepIndicatorProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function StepIndicator({
  currentStep,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full px-4 py-3.5 sm:py-0 sm:h-[62px] flex items-center border-b border-border-subtle">
      <div className="grid grid-cols-3 sm:flex sm:items-center sm:justify-between w-full gap-2 sm:gap-0">
        {WIZARD_STEPS.map((item, index) => {
          const isCurrent = currentStep === item.step;
          const isCompleted = completedSteps.has(item.step);

          return (
            <div
              key={item.step}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-3 relative z-10"
            >
              {/* Step circle indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-200",
                  isCompleted
                    ? "bg-brand text-white border-brand"
                    : isCurrent
                      ? "bg-brand text-white border-brand shadow-xs"
                      : "bg-surface-subtle text-text-subtle border border-border-subtle"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4 stroke-[2.5]" />
                ) : (
                  item.step
                )}
              </div>

              {/* Step texts (widoczne na mobile pod kółkiem, na desktopie obok) */}
              <div className="flex flex-col text-left">
                <span
                  className={cn(
                    "text-sm font-medium leading-tight",
                    isCurrent || isCompleted
                      ? "text-text-main"
                      : "text-text-subtle"
                  )}
                >
                  {item.title}
                </span>
                <span className="text-xs font-normal text-text-subtle leading-tight mt-0.5">
                  {item.subtitle}
                </span>
              </div>

              {/* Connecting line between steps (tylko desktop) */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "hidden sm:block h-[1px] w-12 md:w-16 mx-2 transition-colors",
                    completedSteps.has(item.step)
                      ? "bg-brand"
                      : "bg-border-subtle"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
