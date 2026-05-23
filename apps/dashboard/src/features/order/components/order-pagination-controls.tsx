import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";
import { useOrderFilterStore } from "../stores/use-order-filter-store";

type OrderPaginationControlsProps = {
  totalPages: number;
  total: number;
};

export function OrderPaginationControls({
  totalPages,
  total,
}: OrderPaginationControlsProps) {
  const {
    filter: { page, limit },
    onChangePage,
  } = useOrderFilterStore();

  const start = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  const onPrev = () => {
    if (page <= 1) {
      return;
    }

    onChangePage(page - 1);
  };

  const onNext = () => {
    if (page >= totalPages) {
      return;
    }

    onChangePage(page + 1);
  };

  return (
    <div
      className="flex items-center justify-between"
      id="order-management-pagination"
    >
      <p
        className="text-muted-foreground text-sm"
        id="order-management-pagination-text"
      >
        Showing {start}–{end} of {total} · Page {page} of {totalPages}
      </p>
      <div
        className="flex items-center gap-2"
        id="order-management-pagination-actions"
      >
        <div className="flex flex-col items-center gap-1">
          <Button
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={onPrev}
            size="icon-sm"
            title="Previous page"
            variant="outline"
          >
            <IconChevronLeft />
          </Button>
          <span className="text-muted-foreground text-xs">Prev</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Button
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={onNext}
            size="icon-sm"
            title="Next page"
            variant="outline"
          >
            <IconChevronRight />
          </Button>
          <span className="text-muted-foreground text-xs">Next</span>
        </div>
      </div>
    </div>
  );
}
