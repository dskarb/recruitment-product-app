"use client";

import React from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/formatters";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProductPagination } from "./pagination";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  products: Product[];
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export const ProductTable = React.memo(function ProductTable({
  products,
  totalItems,
  totalPages,
  pageSize,
  currentPage,
  onPageChange,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border/70 bg-white dark:bg-card text-center py-12 text-muted-foreground">
        Brak produktów do wyświetlenia.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-white dark:bg-card overflow-hidden shadow-2xs">
      <Table>
        <TableHeader className="bg-surface-table-header">
          <TableRow className="hover:bg-transparent border-b border-border/70">
            <TableHead className="w-[30%] py-3.5 pl-6 text-sm font-medium text-muted-foreground">
              Nazwa
            </TableHead>
            <TableHead className="w-[16%] py-3.5 text-sm font-medium text-muted-foreground">
              SKU
            </TableHead>
            <TableHead className="w-[16%] py-3.5 text-sm font-medium text-muted-foreground">
              Kategoria
            </TableHead>
            <TableHead className="w-[16%] py-3.5 text-sm font-medium text-muted-foreground">
              Cena Brutto
            </TableHead>
            <TableHead className="w-[12%] py-3.5 text-sm font-medium text-muted-foreground">
              Status
            </TableHead>
            <TableHead className="w-[10%] py-3.5 pr-6 text-sm font-medium text-muted-foreground">
              Magazyn
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow
              key={product.id}
              className={cn(
                "border-b border-border/60 transition-colors",
                product.isNew
                  ? "bg-brand/[0.04] dark:bg-brand/10 border-l-[3px] border-l-brand hover:bg-brand/[0.07]"
                  : "hover:bg-muted/30"
              )}
            >
              <TableCell className="py-4 pl-6 font-medium text-foreground text-sm">
                <div className="flex items-center gap-2">
                  <span>{product.nazwa}</span>
                  {product.isNew && (
                    <Badge variant="brand" className="h-4.5 px-1.5 py-0 text-[10px] font-bold">
                      NOWY
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 text-xs text-muted-foreground font-normal">
                {product.sku}
              </TableCell>
              <TableCell className="py-4 text-sm text-muted-foreground font-normal">
                {product.kategoria}
              </TableCell>
              <TableCell className="py-4 text-sm font-medium text-foreground">
                {formatPrice(product.cenaBrutto, product.waluta)}
              </TableCell>
              <TableCell className="py-4">
                {product.czyDostepny ? (
                  <Badge variant="success">
                    Dostępny
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Niedostępny
                  </Badge>
                )}
              </TableCell>
              <TableCell className="py-4 pr-6 text-sm text-foreground font-normal">
                {product.czyLimitowany && product.iloscMagazyn !== null
                  ? product.iloscMagazyn
                  : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Stopka tabeli z paginacją dokładnie jak w Figmie */}
      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
});
