import { describe, it, expect } from "vitest";
import { formatPrice, pluralizeProducts } from "./formatters";

describe("lib/formatters", () => {
  describe("formatPrice", () => {
    it("formatuje kwotę w polskim standardzie z walutą", () => {
      const result = formatPrice(1234.5, "PLN");
      expect(result).toMatch(/1\s?234,50\u00A0PLN/);
    });

    it("poprawnie formatuje zero", () => {
      const result = formatPrice(0, "EUR");
      expect(result).toBe("0,00\u00A0EUR");
    });

    it("zaokrągla do 2 miejsc po przecinku", () => {
      const result = formatPrice(10.999, "USD");
      expect(result).toBe("11,00\u00A0USD");
    });
  });

  describe("pluralizeProducts", () => {
    it("odmienia dla 1 jako 'produkt'", () => {
      expect(pluralizeProducts(1)).toBe("1 produkt");
    });

    it("odmienia dla 2, 3, 4 jako 'produkty'", () => {
      expect(pluralizeProducts(2)).toBe("2 produkty");
      expect(pluralizeProducts(3)).toBe("3 produkty");
      expect(pluralizeProducts(4)).toBe("4 produkty");
      expect(pluralizeProducts(22)).toBe("22 produkty");
      expect(pluralizeProducts(24)).toBe("24 produkty");
    });

    it("odmienia dla 0, 5..21 jako 'produktów'", () => {
      expect(pluralizeProducts(0)).toBe("0 produktów");
      expect(pluralizeProducts(5)).toBe("5 produktów");
      expect(pluralizeProducts(11)).toBe("11 produktów");
      expect(pluralizeProducts(14)).toBe("14 produktów");
      expect(pluralizeProducts(20)).toBe("20 produktów");
      expect(pluralizeProducts(21)).toBe("21 produktów");
      expect(pluralizeProducts(25)).toBe("25 produktów");
    });

    it("dodaje przyrostek 'w katalogu' gdy withSuffix=true", () => {
      expect(pluralizeProducts(1, true)).toBe("1 produkt w katalogu");
      expect(pluralizeProducts(3, true)).toBe("3 produkty w katalogu");
      expect(pluralizeProducts(10, true)).toBe("10 produktów w katalogu");
    });
  });
});
