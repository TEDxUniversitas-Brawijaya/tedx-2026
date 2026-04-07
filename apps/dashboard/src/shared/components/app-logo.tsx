import { cn } from "@tedx-2026/ui/lib/utils";

type AppLogoProps = {
  size?: number;
  className?: string;
};

export default function AppLogo({ size = 32, className = "" }: AppLogoProps) {
  return (
    <span
      className={cn("font-bold font-heading text-red-2", className)}
      style={{ fontSize: size }}
    >
      TEDxUB
    </span>
  );
}
