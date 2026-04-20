import { cn } from "@tedx-2026/ui/lib/utils";
import { progressSteps } from "../../lib/steps";
import type { TicketCheckoutStep } from "../../types/checkout";

type TicketCheckoutProgressProps = {
  currentStep: TicketCheckoutStep;
  compact?: boolean;
};

export function TicketCheckoutProgress({
  currentStep,
  compact = false,
}: TicketCheckoutProgressProps) {
  // Steps that participate in progress display (idx >= 1)
  const visibleSteps = Object.values(progressSteps).filter((s) => s.idx >= 1);
  const currentStepIndex = progressSteps[currentStep].idx;

  return (
    <div className={cn("flex w-2/3 gap-2", compact ? "mb-4" : "mb-6 sm:mb-8")}>
      {visibleSteps.map((step) => (
        <div
          className={cn(
            "h-0.5 flex-1 rounded-full transition-colors duration-300",
            step.idx <= currentStepIndex ? "bg-[#FF1818]" : "bg-white"
          )}
          key={step.idx}
        />
      ))}
    </div>
  );
}
