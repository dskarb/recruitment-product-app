"use client";

import { useState, useMemo, useCallback } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import { INITIAL_PRODUCTS } from "../data/mock-products";
import { Product } from "../types";

export const DEFAULT_PAGE_SIZE = 5;

export const pageQueryParser = parseAsInteger
  .withDefault(1)
  .withOptions({ shallow: true });

export interface UseProductsOptions {
  pageSize?: number;
  initialData?: Product[];
}

export function useProducts(options: UseProductsOptions = {}) {
  const { pageSize = DEFAULT_PAGE_SIZE, initialData = INITIAL_PRODUCTS } = options;

  const [products, setProducts] = useState<Product[]>(initialData);
  const [page, setPage] = useQueryState("page", pageQueryParser);

  const addProduct = useCallback(
    (newProduct: Product) => {
      setProducts((prev) => [{ ...newProduct, isNew: true }, ...prev]);
      setPage(1);
    },
    [setPage]
  );

  const totalItems = products.length;
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );
  const currentPage = useMemo(
    () => Math.max(1, Math.min(page, totalPages)),
    [page, totalPages]
  );

  const paginatedProducts = useMemo(
    () =>
      products.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      ),
    [products, currentPage, pageSize]
  );

  return {
    products,
    paginatedProducts,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    page,
    setPage,
    addProduct,
  };
}
