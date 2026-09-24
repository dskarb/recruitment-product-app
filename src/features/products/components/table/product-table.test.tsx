import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductTable } from "./product-table";
import { Product } from "../../types";

const mockProducts: Product[] = [
  {
    id: "prod-1",
    nazwa: "Klawiatura Mechaniczna Pro",
    sku: "KEY100",
    producent: "Keychron",
    kategoria: "Akcesoria",
    cechy: ["Nowość"],
    cenaNetto: 100,
    cenaBrutto: 123,
    vat: 23,
    waluta: "PLN",
    czyDostepny: true,
    czyLimitowany: true,
    iloscMagazyn: 15,
    minKoszyk: 1,
    maxKoszyk: 5,
    createdAt: new Date().toISOString(),
    isNew: true,
  },
  {
    id: "prod-2",
    nazwa: "Myszka Biurowa",
    sku: "MOU200",
    producent: "Logitech",
    kategoria: "Peryferia",
    cechy: ["Bestseller"],
    cenaNetto: 50,
    cenaBrutto: 61.5,
    vat: 23,
    waluta: "PLN",
    czyDostepny: false,
    czyLimitowany: false,
    iloscMagazyn: null,
    minKoszyk: 1,
    maxKoszyk: 10,
    createdAt: new Date().toISOString(),
    isNew: false,
  },
];

describe("components/product-table/ProductTable", () => {
  it("wyświetla komunikat o braku produktów, gdy lista jest pusta", () => {
    render(
      <ProductTable
        products={[]}
        totalItems={0}
        totalPages={1}
        pageSize={5}
        currentPage={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText("Brak produktów do wyświetlenia.")).toBeInTheDocument();
  });

  it("renderuje wiersze produktów z poprawnymi danymi", () => {
    render(
      <ProductTable
        products={mockProducts}
        totalItems={2}
        totalPages={1}
        pageSize={5}
        currentPage={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText("Klawiatura Mechaniczna Pro")).toBeInTheDocument();
    expect(screen.getByText("KEY100")).toBeInTheDocument();
    expect(screen.getByText("Myszka Biurowa")).toBeInTheDocument();
    expect(screen.getByText("MOU200")).toBeInTheDocument();

    // Sprawdzenie statusów
    expect(screen.getByText("Dostępny")).toBeInTheDocument();
    expect(screen.getByText("Niedostępny")).toBeInTheDocument();

    // Sprawdzenie ilości magazynowej
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("wyświetla badge 'NOWY' dla produktów oznaczonych jako isNew", () => {
    render(
      <ProductTable
        products={mockProducts}
        totalItems={2}
        totalPages={1}
        pageSize={5}
        currentPage={1}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText("NOWY")).toBeInTheDocument();
  });
});
