import { ShoppingCart } from "lucide-react";
import Chandelier from "@/assets/imgs/chandelier-1.png";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { CheckoutProgress } from "./checkout-progress";
import type { CheckoutModalViewProps } from "../../types/merch-view";

export function CheckoutModal({
  children,
  currentStep,
  isModalOpen,
  itemCount,
  onOpenCart,
  onOpenChange,
}: CheckoutModalViewProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={isModalOpen}>
      <DialogTrigger
        render={
          <button
            className="relative flex cursor-pointer items-center rounded-lg border-2 border-[#1A1A1A] p-2 transition-colors hover:bg-black/5"
            onClick={onOpenCart}
            type="button"
          >
            <ShoppingCart />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-[#FF1818] text-[10px] text-white">
                {itemCount}
              </span>
            )}
          </button>
        }
      />
      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] max-w-[20rem] overflow-hidden rounded-3xl border-none bg-black p-0 text-white shadow-[0_0_100px_2px_rgba(255,149,0,0.25)] *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white sm:w-full sm:max-w-lg">
        <img
          alt="chandelier"
          aria-hidden="true"
          className="pointer-events-none absolute -top-15 -right-15 z-1 w-44 opacity-30 md:w-56"
          height={300}
          src={Chandelier}
          width={150}
        />
        <div className="relative z-2 w-full p-4 sm:p-8">
          {currentStep !== "selection" && currentStep !== "success" && (
            <CheckoutProgress
              compact={currentStep === "payment"}
              currentStep={currentStep}
            />
          )}
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
