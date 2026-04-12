import { cn } from "@tedx-2026/ui/lib/utils";
import { progressSteps, type CheckoutStep } from "../../types/types";

type CheckoutProgressProps = {
  currentStep: CheckoutStep;
  compact?: boolean;
};

export function CheckoutProgress({
  currentStep,
  compact = false,
}: CheckoutProgressProps) {
  const currentStepIndex = progressSteps.indexOf(currentStep);

  return (
    <div className={cn("flex w-2/3 gap-2", compact ? "mb-4" : "mb-6 sm:mb-8")}>
      {progressSteps.map((step, i) => (
        <div
          className={cn(
            "h-0.5 flex-1 rounded-full transition-colors duration-300",
            i <= currentStepIndex ? "bg-[#FF1818]" : "bg-white"
          )}
          key={step}
        />
      ))}
    </div>
  );
}
