"use client";

import { Suspense } from "react";
import { useProducts, DEFAULT_PAGE_SIZE } from "@/hooks/use-products";
import { pluralizeProducts } from "@/lib/formatters";
import { ProductTable } from "@/components/product-table/product-table";
import { ProductCards } from "@/components/product-table/product-cards";
import { ProductPagination } from "@/components/product-table/pagination";
import { ProductDialog } from "@/components/product-dialog/product-dialog";

function ProductsContent() {
  const {
    paginatedProducts,
    totalItems,
    totalPages,
    pageSize,
    currentPage,
    setPage,
    addProduct,
  } = useProducts({ pageSize: DEFAULT_PAGE_SIZE });

  return (
    <div className="min-h-screen bg-surface-page">
      <main className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="w-full max-w-[1240px] mx-auto space-y-6">
          <div className="flex items-center justify-between pb-1">
            <div>
              <h1 className="text-[20px] font-semibold leading-7 text-text-main">
                Produkty
              </h1>
              <p className="text-sm font-normal text-text-subtle mt-0.5">
                {pluralizeProducts(totalItems, true)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <ProductDialog onAddProduct={addProduct} />
            </div>
          </div>

          {/* Widok tabeli: Desktop */}
          <div className="hidden md:block">
            <ProductTable
              products={paginatedProducts}
              totalItems={totalItems}
              totalPages={totalPages}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={setPage}
            />
          </div>

          {/* Widok kart: Mobile */}
          <div className="block md:hidden space-y-4">
            <ProductCards products={paginatedProducts} />
            <ProductPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageChange={setPage}
              variant="mobile"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface-page flex items-center justify-center">
          <div className="text-sm text-muted-foreground">Ładowanie katalogu...</div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
