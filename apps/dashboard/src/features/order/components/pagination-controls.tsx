import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";

type PaginationControlsProps = {
  currentPage: number;
  onNext: () => void;
  onPrev: () => void;
  page: number;
  totalPages: number;
};

export function PaginationControls({
  currentPage,
  onNext,
  onPrev,
  page,
  totalPages,
}: PaginationControlsProps) {
  return (
    <div
      className="flex items-center justify-between"
      id="order-management-pagination"
    >
      <p
        className="text-muted-foreground text-sm"
        id="order-management-pagination-text"
      >
        Page {currentPage} of {totalPages}
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
