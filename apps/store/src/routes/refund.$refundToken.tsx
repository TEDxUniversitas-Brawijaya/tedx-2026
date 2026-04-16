import { RefundPageContainer } from "@/features/refund/containers/refund-page-container";
import { Footer } from "@/shared/components/footer";
import { Navbar } from "@/shared/components/navbar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund/$refundToken")({
  component: RouteComponent,
});

function RouteComponent() {
  const { refundToken } = Route.useParams();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <RefundPageContainer refundToken={refundToken} />
      <Footer />
    </main>
  );
}
