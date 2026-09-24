import { describe, it, expect } from "vitest";
import { sanitizePriceInput, calculateBrutto, calculateNetto } from "./pricing";

describe("lib/pricing", () => {
  describe("sanitizePriceInput", () => {
    it("zamienia przecinek na kropkę", () => {
      expect(sanitizePriceInput("12,50")).toBe("12.50");
    });

    it("usuwa litery, spacje i znaki specjalne", () => {
      expect(sanitizePriceInput(" 12a3 bc$ ")).toBe("123");
    });

    it("pozwala na maksymalnie jedną kropkę dziesiętną", () => {
      expect(sanitizePriceInput("12.3.4")).toBe("12.34");
      expect(sanitizePriceInput("12..50")).toBe("12.50");
    });

    it("ogranicza liczbę miejsc po przecinku do 2", () => {
      expect(sanitizePriceInput("12.34567")).toBe("12.34");
      expect(sanitizePriceInput("99.999")).toBe("99.99");
    });

    it("obsługuje pusty ciąg znaków", () => {
      expect(sanitizePriceInput("")).toBe("");
    });
  });

  describe("calculateBrutto", () => {
    it("poprawnie wylicza kwotę brutto dla stawki VAT 23%", () => {
      expect(calculateBrutto(100, 23)).toBe("123.00");
    });

    it("poprawnie wylicza kwotę brutto dla stawki VAT 8%", () => {
      expect(calculateBrutto(100, 8)).toBe("108.00");
    });

    it("poprawnie wylicza kwotę brutto dla stawki VAT 5%", () => {
      expect(calculateBrutto(100, 5)).toBe("105.00");
    });

    it("poprawnie wylicza kwotę brutto dla stawki VAT 0%", () => {
      expect(calculateBrutto(150, 0)).toBe("150.00");
    });

    it("zaokrągla do 2 miejsc po przecinku", () => {
      expect(calculateBrutto(99.99, 23)).toBe("122.99");
    });

    it("zwraca pusty string dla wartości ujemnych lub NaN", () => {
      expect(calculateBrutto(-50, 23)).toBe("");
      expect(calculateBrutto(NaN, 23)).toBe("");
    });
  });

  describe("calculateNetto", () => {
    it("poprawnie wylicza kwotę netto dla stawki VAT 23%", () => {
      expect(calculateNetto(123, 23)).toBe("100.00");
    });

    it("poprawnie wylicza kwotę netto dla stawki VAT 8%", () => {
      expect(calculateNetto(108, 8)).toBe("100.00");
    });

    it("poprawnie wylicza kwotę netto dla stawki VAT 5%", () => {
      expect(calculateNetto(105, 5)).toBe("100.00");
    });

    it("poprawnie wylicza kwotę netto dla stawki VAT 0%", () => {
      expect(calculateNetto(250, 0)).toBe("250.00");
    });

    it("zaokrągla do 2 miejsc po przecinku", () => {
      expect(calculateNetto(122.99, 23)).toBe("99.99");
    });

    it("zwraca pusty string dla wartości ujemnych lub NaN", () => {
      expect(calculateNetto(-100, 23)).toBe("");
      expect(calculateNetto(NaN, 23)).toBe("");
    });
  });
});
