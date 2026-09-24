import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { NuqsTestingAdapter } from "nuqs/adapters/testing";
import { useProducts } from "./use-products";
import { Product } from "../types";

const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `prod-${i + 1}`,
  nazwa: `Produkt ${i + 1}`,
  sku: `SKU${i + 1}`,
  producent: "Producent A",
  kategoria: "Kategoria A",
  cechy: ["Nowość"],
  cenaNetto: 100,
  cenaBrutto: 123,
  vat: 23,
  waluta: "PLN",
  czyDostepny: true,
  czyLimitowany: false,
  iloscMagazyn: null,
  minKoszyk: 1,
  maxKoszyk: 10,
  createdAt: new Date().toISOString(),
}));

describe("hooks/useProducts", () => {
  it("inicjalizuje stan z poprawną paginacją", () => {
    const { result } = renderHook(
      () => useProducts({ pageSize: 5, initialData: mockProducts }),
      { wrapper: NuqsTestingAdapter }
    );

    expect(result.current.totalItems).toBe(12);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedProducts.length).toBe(5);
    expect(result.current.paginatedProducts[0].id).toBe("prod-1");
  });

  it("pozwala na zmianę strony", async () => {
    const { result } = renderHook(
      () => useProducts({ pageSize: 5, initialData: mockProducts }),
      { wrapper: NuqsTestingAdapter }
    );

    await act(async () => {
      await result.current.setPage(2);
    });

    expect(result.current.currentPage).toBe(2);
    expect(result.current.paginatedProducts.length).toBe(5);
    expect(result.current.paginatedProducts[0].id).toBe("prod-6");
  });

  it("dodaje nowy produkt na początek listy i resetuje stronę do 1", async () => {
    const { result } = renderHook(
      () => useProducts({ pageSize: 5, initialData: mockProducts }),
      { wrapper: NuqsTestingAdapter }
    );

    // Przejście na stronę 2
    await act(async () => {
      await result.current.setPage(2);
    });
    expect(result.current.currentPage).toBe(2);

    const newProd: Product = {
      id: "prod-new",
      nazwa: "Nowiutki Produkt",
      sku: "SKUNEW",
      producent: "Producent B",
      kategoria: "Kategoria B",
      cechy: ["Bestseller"],
      cenaNetto: 200,
      cenaBrutto: 246,
      vat: 23,
      waluta: "PLN",
      czyDostepny: true,
      czyLimitowany: false,
      iloscMagazyn: null,
      minKoszyk: 1,
      maxKoszyk: 5,
      createdAt: new Date().toISOString(),
    };

    await act(async () => {
      result.current.addProduct(newProd);
    });

    expect(result.current.totalItems).toBe(13);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.paginatedProducts[0].id).toBe("prod-new");
    expect(result.current.paginatedProducts[0].isNew).toBe(true);
  });
});
