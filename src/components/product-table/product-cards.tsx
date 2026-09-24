"use client";

import React from "react";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductCardsProps {
  products: Product[];
}

export const ProductCards = React.memo(function ProductCards({
  products,
}: ProductCardsProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        Brak produktów do wyświetlenia.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {products.map((product) => (
        <div
          key={product.id}
          className={cn(
            "rounded-xl bg-white dark:bg-card p-3 space-y-2 shadow-2xs transition-all",
            product.isNew
              ? "border-2 border-brand"
              : "border border-border-subtle"
          )}
        >
          {/* Header: Nazwa, NOWY badge, SKU i Status */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-medium text-text-main leading-tight">
                  {product.nazwa}
                </h3>
                {product.isNew && (
                  <Badge variant="brand" className="h-4.5 px-1.5 py-0 text-[10px] font-bold">
                    NOWY
                  </Badge>
                )}
              </div>
              <p className="text-xs text-text-subtle mt-0.5 font-normal">
                {product.sku}
              </p>
            </div>
            <Badge variant={product.czyDostepny ? "success" : "destructive"}>
              {product.czyDostepny ? "Dostępny" : "Niedostępny"}
            </Badge>
          </div>
          {/* Szara ramka z detalami (3 kolumny: Kategoria, Cena brutto, Magazyn) */}
          <div className={cn(
            "rounded-[9px] p-3 grid grid-cols-3 gap-2",
            product.isNew
              ? "bg-surface-brand"
              : "bg-surface-subtle"
          )}
          >
            <div>
              <span className="block text-xs text-text-subtle font-normal">
                Kategoria
              </span>
              <span className="block text-sm text-text-main font-normal truncate mt-0.5">
                {product.kategoria}
              </span>
            </div>

            <div>
              <span className="block text-xs text-text-subtle font-normal">
                Cena brutto
              </span>
              <span className="block text-sm font-medium text-text-main truncate mt-0.5">
                {formatPrice(product.cenaBrutto, product.waluta)}
              </span>
            </div>

            <div>
              <span className="block text-xs text-text-subtle font-normal">
                Magazyn
              </span>
              <span className="block text-sm text-text-main font-normal mt-0.5">
                {product.czyLimitowany && product.iloscMagazyn !== null
                  ? product.iloscMagazyn
                  : "—"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
