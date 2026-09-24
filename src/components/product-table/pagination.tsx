"use client";

import React, { useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { pluralizeProducts } from "@/lib/formatters";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  variant?: "table" | "mobile";
}

export const ProductPagination = React.memo(function ProductPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  variant = "table",
}: PaginationProps) {
  const calculatedTotalPages = Math.max(
    1,
    totalPages || Math.ceil(totalItems / (pageSize || 1))
  );
  const safeCurrentPage = Math.max(1, Math.min(currentPage, calculatedTotalPages));

  const fromItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const toItem = Math.min(safeCurrentPage * pageSize, totalItems);

  const handlePrev = useCallback(() => {
    if (safeCurrentPage > 1) {
      onPageChange(safeCurrentPage - 1);
    }
  }, [safeCurrentPage, onPageChange]);

  const handleNext = useCallback(() => {
    if (safeCurrentPage < calculatedTotalPages) {
      onPageChange(safeCurrentPage + 1);
    }
  }, [safeCurrentPage, calculatedTotalPages, onPageChange]);

  const pages = useMemo(
    () => Array.from({ length: calculatedTotalPages }, (_, i) => i + 1),
    [calculatedTotalPages]
  );

  const isMobile = variant === "mobile";
  const canGoPrev = safeCurrentPage > 1;
  const canGoNext = safeCurrentPage < calculatedTotalPages;

  // Pagination controls JSX (shared between mobile and table with tailored size classes)
  const paginationControls = (
    <div
      className={cn(
        "flex items-center select-none",
        isMobile ? "gap-3" : "gap-1.5"
      )}
    >
      {/* Przycisk Wstecz */}
      <button
        type="button"
        onClick={handlePrev}
        disabled={!canGoPrev}
        aria-label="Poprzednia strona"
        className={cn(
          "flex items-center font-medium transition-colors cursor-pointer",
          isMobile
            ? "gap-1 text-sm"
            : "gap-1 px-2.5 py-1 text-xs rounded-md",
          !canGoPrev
            ? isMobile
              ? "text-text-subtle/40 cursor-not-allowed"
              : "text-muted-foreground/40 cursor-not-allowed"
            : isMobile
              ? "text-text-main hover:text-brand"
              : "text-foreground hover:bg-muted"
        )}
      >
        <ChevronLeft className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
        <span>Wstecz</span>
      </button>

      {/* Numery stron */}
      <div className={cn("flex items-center", isMobile ? "gap-1.5" : "gap-1")}>
        {pages.map((p) => {
          const isActive = p === safeCurrentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-label={`Strona ${p}`}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-center font-medium transition-colors cursor-pointer",
                isMobile ? "w-8 h-8 rounded-lg text-sm" : "w-7 h-7 rounded-md text-xs",
                isActive
                  ? "bg-brand text-white font-semibold shadow-2xs"
                  : isMobile
                    ? "text-text-main hover:bg-black/5 dark:hover:bg-white/5"
                    : "text-foreground hover:bg-muted"
              )}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Przycisk Dalej */}
      <button
        type="button"
        onClick={handleNext}
        disabled={!canGoNext}
        aria-label="Następna strona"
        className={cn(
          "flex items-center font-medium transition-colors cursor-pointer",
          isMobile
            ? "gap-1 text-sm"
            : "gap-1 px-2.5 py-1 text-xs rounded-md",
          !canGoNext
            ? isMobile
              ? "text-text-subtle/40 cursor-not-allowed"
              : "text-muted-foreground/40 cursor-not-allowed"
            : isMobile
              ? "text-text-main hover:text-brand"
              : "text-foreground hover:bg-muted"
        )}
      >
        <span>Dalej</span>
        <ChevronRight className={isMobile ? "h-4 w-4" : "h-3.5 w-3.5"} />
      </button>
    </div>
  );

  const statusLabel = (
    <div
      title={totalItems > 0 ? `Pozycje ${fromItem}–${toItem} z ${totalItems}` : undefined}
      className={cn(
        "font-normal select-none",
        isMobile
          ? "text-center text-xs text-text-subtle"
          : "text-center sm:text-left text-xs text-muted-foreground"
      )}
    >
      Strona {safeCurrentPage} z {totalPages || 1} · {pluralizeProducts(totalItems)}
    </div>
  );

  if (isMobile) {
    return (
      <nav aria-label="Paginacja produktów" className="flex flex-col items-center justify-center gap-3 pt-3 pb-2">
        {statusLabel}
        {paginationControls}
      </nav>
    );
  }

  return (
    <nav
      aria-label="Paginacja tabeli produktów"
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-6 text-xs text-muted-foreground bg-surface-table-header/70 dark:bg-muted/20 border-t border-border/70 rounded-b-xl"
    >
      {statusLabel}
      {paginationControls}
    </nav>
  );
});
