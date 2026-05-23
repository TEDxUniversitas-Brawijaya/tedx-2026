import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";
import { useMerchPickupFilterStore } from "../stores/use-merch-pickup-filter-store";

type MerchPickupPaginationControlsProps = {
  totalPages: number;
  total: number;
};

export function MerchPickupPaginationControls({
  totalPages,
  total,
}: MerchPickupPaginationControlsProps) {
  const {
    filter: { page, limit },
    onChangePage,
  } = useMerchPickupFilterStore();
  const pageCount = Math.max(totalPages, 1);
  const start = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <div className="flex items-center justify-between" id="merch-pickup-pages">
      <p className="text-muted-foreground text-sm">
        Showing {start}–{end} of {total} · Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-2">
        <Button
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onChangePage(page - 1)}
          size="icon-sm"
          title="Previous page"
          variant="outline"
        >
          <IconChevronLeft />
        </Button>
        <Button
          aria-label="Next page"
          disabled={page >= pageCount}
          onClick={() => onChangePage(page + 1)}
          size="icon-sm"
          title="Next page"
          variant="outline"
        >
          <IconChevronRight />
        </Button>
      </div>
    </div>
  );
}
