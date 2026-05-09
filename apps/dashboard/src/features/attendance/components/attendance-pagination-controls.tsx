import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button } from "@tedx-2026/ui/components/button";
import { useAttendanceFilterStore } from "../stores/use-attendance-filter-store";

type AttendancePaginationControlsProps = {
  totalPages: number;
};

export function AttendancePaginationControls({
  totalPages,
}: AttendancePaginationControlsProps) {
  const {
    filter: { page },
    onChangePage,
  } = useAttendanceFilterStore();
  const pageCount = Math.max(totalPages, 1);

  return (
    <div className="flex items-center justify-between" id="attendance-pages">
      <p className="text-muted-foreground text-sm">
        Page {page} of {pageCount}
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
