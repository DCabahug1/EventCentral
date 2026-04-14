"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type PaginationBarProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Accessible label for the region, e.g. "Happening Now results". */
  label: string;
};

export default function PaginationBar({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
  label,
}: PaginationBarProps) {
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <nav
      className={cn(
        "flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4 w-full",
        className,
      )}
      aria-label={`Pagination for ${label}`}
    >
      <p className="text-sm text-muted-foreground order-2 sm:order-1">
        Showing {start}–{end} of {totalItems}
      </p>
      <div className="flex items-center gap-2 order-1 sm:order-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-4" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
        <span className="text-sm text-muted-foreground tabular-nums min-w-20 text-center">
          {page} / {totalPages}
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}
