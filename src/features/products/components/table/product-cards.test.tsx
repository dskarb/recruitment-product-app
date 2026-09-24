import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCards } from "./product-cards";
import { Product } from "../../types";

const mockProducts: Product[] = [
  {
    id: "prod-1",
    nazwa: "MacBook Pro 16",
    sku: "MBP16",
    producent: "Apple",
    kategoria: "Komputery",
    cechy: ["Nowość"],
    cenaNetto: 10000,
    cenaBrutto: 12300,
    vat: 23,
    waluta: "PLN",
    czyDostepny: true,
    czyLimitowany: true,
    iloscMagazyn: 5,
    minKoszyk: 1,
    maxKoszyk: 2,
    createdAt: new Date().toISOString(),
    isNew: true,
  },
  {
    id: "prod-2",
    nazwa: "Słuchawki Sony",
    sku: "SNY01",
    producent: "Sony",
    kategoria: "RTV",
    cechy: ["Promocja"],
    cenaNetto: 500,
    cenaBrutto: 615,
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

describe("components/product-table/ProductCards (Mobile View)", () => {
  it("wyświetla komunikat o braku produktów, gdy lista jest pusta", () => {
    render(<ProductCards products={[]} />);
    expect(screen.getByText("Brak produktów do wyświetlenia.")).toBeInTheDocument();
  });

  it("renderuje karty produktów z wymaganymi danymi", () => {
    render(<ProductCards products={mockProducts} />);

    expect(screen.getByText("MacBook Pro 16")).toBeInTheDocument();
    expect(screen.getByText("MBP16")).toBeInTheDocument();
    expect(screen.getByText("Komputery")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();

    expect(screen.getByText("Słuchawki Sony")).toBeInTheDocument();
    expect(screen.getByText("SNY01")).toBeInTheDocument();
    expect(screen.getByText("RTV")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renderuje badge 'NOWY' oraz statusy dostępności", () => {
    render(<ProductCards products={mockProducts} />);

    expect(screen.getByText("NOWY")).toBeInTheDocument();
    expect(screen.getByText("Dostępny")).toBeInTheDocument();
    expect(screen.getByText("Niedostępny")).toBeInTheDocument();
  });
});
