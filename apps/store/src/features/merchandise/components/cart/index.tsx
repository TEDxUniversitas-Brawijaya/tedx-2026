import Chandelier from "@/assets/imgs/chandelier-1.png";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "../../stores/use-cart-store";
import { CheckoutProgress } from "./checkout-progress";

export function CheckoutModal({ children }: { children: React.ReactNode }) {
  const { items, isModalOpen, currentStep, setIsModalOpen } = useCartStore();

  const itemCount = items.reduce(
    (accumulator, item) => accumulator + item.quantity,
    0
  );

  return (
    <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
      <DialogTrigger
        render={
          <button
            className="relative flex cursor-pointer items-center rounded-lg border-2 border-[#1A1A1A] p-2 transition-colors hover:bg-black/5"
            type="button"
          />
        }
      >
        <ShoppingCart className="text-black" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 flex aspect-square h-5 w-5 items-center justify-center rounded-full bg-[#FF1818] text-[10px] text-white">
            {itemCount}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-[90%] overflow-hidden rounded-3xl border-none bg-black p-0 text-white shadow-[0_0_100px_2px_rgba(255,149,0,0.25)] *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white md:w-full md:max-w-lg">
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
