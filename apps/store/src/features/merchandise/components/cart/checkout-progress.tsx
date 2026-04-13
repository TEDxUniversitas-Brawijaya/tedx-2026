import { cn } from "@tedx-2026/ui/lib/utils";
import { progressSteps, type CheckoutStep } from "../../lib/steps";

type CheckoutProgressProps = {
  currentStep: CheckoutStep;
  compact?: boolean;
};

export function CheckoutProgress({
  currentStep,
  compact = false,
}: CheckoutProgressProps) {
  const currentStepIndex = progressSteps[currentStep].idx;

  return (
    <div className={cn("flex w-2/3 gap-2", compact ? "mb-4" : "mb-6 sm:mb-8")}>
      {Array.from({ length: Object.keys(progressSteps).length }, (_, i) => {
        const step = Object.values(progressSteps)[i];
        if (!step) {
          return null;
        }

        return (
          <div
            className={cn(
              "h-0.5 flex-1 rounded-full transition-colors duration-300",
              i <= currentStepIndex ? "bg-[#FF1818]" : "bg-white"
            )}
            key={step.idx}
          />
        );
      })}
    </div>
  );
}
