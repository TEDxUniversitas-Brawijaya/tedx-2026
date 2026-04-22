import Chandelier from "@/assets/imgs/chandelier-1.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tedx-2026/ui/components/dialog";
import { Info } from "lucide-react";

type SizeChartDialogProps = {
  category: string;
};

export function SizeChartDialog({ category }: SizeChartDialogProps) {
  if (category !== "t-shirt" && category !== "workshirt") {
    return null;
  }

  const isTshirt = category === "t-shirt";
  const imageSrc = isTshirt
    ? "/imgs/sizechart-shirt.jpeg"
    : "/imgs/sizechart-workshirt.jpeg";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className="inline-flex cursor-pointer items-center justify-center rounded-full text-gray-2 transition-colors hover:bg-white/10 hover:text-white focus:outline-none"
            title="Lihat Size Chart"
            type="button"
          />
        }
      >
        <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
      </DialogTrigger>
      <DialogContent className="max-h-[92vh] max-w-[90%] overflow-hidden rounded-3xl border-none bg-black p-0 text-white *:data-[slot=dialog-close]:z-20 *:data-[slot=dialog-close]:bg-transparent *:data-[slot=dialog-close]:text-white md:w-full md:max-w-lg">
        <img
          alt="chandelier"
          aria-hidden="true"
          className="pointer-events-none absolute -top-15 -right-15 z-1 w-44 opacity-30 md:w-56"
          height={300}
          src={Chandelier}
          width={150}
        />
        <div className="relative z-2 flex max-h-[92vh] w-full flex-col p-4 sm:p-8">
          <DialogHeader className="mb-4 shrink-0 text-left">
            <DialogTitle className="font-serif-2 text-white text-xl sm:text-2xl">
              Size Chart {isTshirt ? "T-Shirt" : "Workshirt"}
            </DialogTitle>
          </DialogHeader>
          <div className="no-scrollbar flex-1 overflow-y-scroll rounded-2xl bg-white">
            <div className="relative flex min-h-max w-full items-center justify-center">
              <img
                alt={`Size chart ${isTshirt ? "T-Shirt" : "Workshirt"}`}
                className="h-auto w-full object-contain mix-blend-multiply"
                height={800}
                src={imageSrc}
                width={800}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
