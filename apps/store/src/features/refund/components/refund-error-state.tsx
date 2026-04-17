import type { RefundErrorCode } from "../types";
import bg from "@/assets/imgs/texture-black.png";

type RefundErrorStateProps = {
  code: RefundErrorCode;
  message: string;
};

const ERROR_COPY: Record<
  Exclude<RefundErrorCode, "UNKNOWN">,
  { title: string; description: string }
> = {
  INVALID_REFUND_TOKEN: {
    title: "Invalid refund link",
    description:
      "The refund link is invalid or has expired. Please use the latest link sent to your email.",
  },
  ORDER_NOT_REFUNDABLE: {
    title: "Order is not refundable",
    description:
      "This order cannot be refunded because it is not in paid status.",
  },
  REFUND_DEADLINE_PASSED: {
    title: "Refund deadline passed",
    description:
      "The refund window for this order has closed based on the configured event deadline.",
  },
  REFUND_ALREADY_REQUESTED: {
    title: "Refund already requested",
    description:
      "A pending refund request already exists for this order. Please wait for admin review.",
  },
};

export function RefundErrorState({ code, message }: RefundErrorStateProps) {
  const content =
    code === "UNKNOWN"
      ? {
          title: "Unable to load refund form",
          description: message,
        }
      : ERROR_COPY[code];

  return (
    <section
      className="mx-auto grid min-h-screen place-content-center bg-center bg-cover px-4 py-16 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="rounded-2xl border border-white/20 bg-black p-8 text-white shadow-xl">
        <h1 className="font-serif-2 text-3xl">{content.title}</h1>
        <p className="mt-4 font-sans-2 text-gray-2">{content.description}</p>
      </div>
    </section>
  );
}
