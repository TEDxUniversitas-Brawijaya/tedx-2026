import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tedx-2026/ui/components/card";

type PendingActionsSectionProps = {
  pendingVerificationsCount: number;
  refundRequestedCount: number;
};

export function PendingActionsSection({
  pendingVerificationsCount,
  refundRequestedCount,
}: PendingActionsSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">Pending Actions</h2>
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`font-bold text-3xl tabular-nums ${pendingVerificationsCount > 0 ? "text-yellow-500" : "text-muted-foreground"}`}
            >
              {pendingVerificationsCount}
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Refund Requested
            </CardTitle>
          </CardHeader>
          <CardContent>
            <span
              className={`font-bold text-3xl tabular-nums ${refundRequestedCount > 0 ? "text-orange-500" : "text-muted-foreground"}`}
            >
              {refundRequestedCount}
            </span>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
