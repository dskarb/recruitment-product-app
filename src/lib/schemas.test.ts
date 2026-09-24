import { describe, it, expect } from "vitest";
import {
  step1Schema,
  step2Schema,
  step3Schema,
  mapFormDataToProduct,
  mapZodErrors,
} from "./schemas";
import { ProductFormData } from "./types";

describe("lib/schemas", () => {
  describe("step1Schema - Dane podstawowe", () => {
    const validStep1 = {
      nazwa: "Monitor UltraWide 34\"",
      sku: "MON34UW01",
      opis: "Profesjonalny monitor do pracy biurowej",
      producent: "Dell",
      kategoria: "Elektronika",
      cechy: ["Nowość", "Bestseller"],
    };

    it("akceptuje poprawne dane pierwszego kroku", () => {
      const result = step1Schema.safeParse(validStep1);
      expect(result.success).toBe(true);
    });

    it("odrzuca nazwę krótszą niż 3 znaki", () => {
      const result = step1Schema.safeParse({ ...validStep1, nazwa: "AB" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nazwa produktu musi mieć co najmniej 3 znaki");
      }
    });

    it("odrzuca nazwę dłuższą niż 120 znaków", () => {
      const longName = "A".repeat(121);
      const result = step1Schema.safeParse({ ...validStep1, nazwa: longName });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Nazwa produktu może mieć maksymalnie 120 znaków");
      }
    });

    it("wymaga niepustego SKU i odrzuca znaki specjalne oraz spacje", () => {
      expect(step1Schema.safeParse({ ...validStep1, sku: "" }).success).toBe(false);
      expect(step1Schema.safeParse({ ...validStep1, sku: "SKU 123" }).success).toBe(false);
      expect(step1Schema.safeParse({ ...validStep1, sku: "SKU-123" }).success).toBe(false);
      expect(step1Schema.safeParse({ ...validStep1, sku: "SKU123" }).success).toBe(true);
    });

    it("wymaga wyboru producenta i kategorii", () => {
      expect(step1Schema.safeParse({ ...validStep1, producent: "" }).success).toBe(false);
      expect(step1Schema.safeParse({ ...validStep1, kategoria: "" }).success).toBe(false);
    });

    it("wymaga wybrania co najmniej jednej cechy", () => {
      const result = step1Schema.safeParse({ ...validStep1, cechy: [] });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Wybierz co najmniej jedną cechę produktu");
      }
    });
  });

  describe("step2Schema - Cena i podatki", () => {
    it("akceptuje poprawne i spójne kwoty netto i brutto", () => {
      const result = step2Schema.safeParse({
        cenaNetto: "100.00",
        cenaBrutto: "123.00",
        vat: 23,
        waluta: "PLN",
      });
      expect(result.success).toBe(true);
    });

    it("obsługuje przecinki w wartościach cenowych", () => {
      const result = step2Schema.safeParse({
        cenaNetto: "100,00",
        cenaBrutto: "123,00",
        vat: 23,
        waluta: "PLN",
      });
      expect(result.success).toBe(true);
    });

    it("odrzuca kwoty niespójne ze stawką VAT", () => {
      const result = step2Schema.safeParse({
        cenaNetto: "100.00",
        cenaBrutto: "150.00", // Zamiast 123.00
        vat: 23,
        waluta: "PLN",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const errorMessages = result.error.issues.map((i) => i.message);
        expect(errorMessages).toContain("Cena brutto jest niespójna z ceną netto i stawką VAT");
      }
    });

    it("odrzuca ceny zerowe lub ujemne", () => {
      const result = step2Schema.safeParse({
        cenaNetto: "0",
        cenaBrutto: "0",
        vat: 23,
        waluta: "PLN",
      });
      expect(result.success).toBe(false);
    });

    it("odrzuca ceny przekraczające limit 10 000 000", () => {
      const result = step2Schema.safeParse({
        cenaNetto: "10000001",
        cenaBrutto: "12300001.23",
        vat: 23,
        waluta: "PLN",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("step3Schema - Magazyn i dostępność", () => {
    const validStep3 = {
      czyDostepny: true,
      czyLimitowany: false,
      iloscMagazyn: "",
      minKoszyk: "1",
      maxKoszyk: "10",
    };

    it("akceptuje poprawne dane dla produktu nielimitowanego", () => {
      const result = step3Schema.safeParse(validStep3);
      expect(result.success).toBe(true);
    });

    it("wymaga podania stanu magazynowego jeśli produkt jest limitowany", () => {
      const result = step3Schema.safeParse({
        ...validStep3,
        czyLimitowany: true,
        iloscMagazyn: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Podaj ilość na magazynie dla produktu limitowanego");
      }
    });

    it("akceptuje poprawny stan magazynowy dla produktu limitowanego", () => {
      const result = step3Schema.safeParse({
        ...validStep3,
        czyLimitowany: true,
        iloscMagazyn: "50",
      });
      expect(result.success).toBe(true);
    });

    it("waliduje relację minKoszyk <= maxKoszyk", () => {
      const result = step3Schema.safeParse({
        ...validStep3,
        minKoszyk: "10",
        maxKoszyk: "2",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const messages = result.error.issues.map((i) => i.message);
        expect(messages).toContain("Minimalna ilość nie może być większa niż maksymalna");
      }
    });
  });

  describe("mapFormDataToProduct", () => {
    it("prawidłowo transformuje pełne dane formularza na encję Product", () => {
      const formData: ProductFormData = {
        nazwa: "  Klawiatura Mechaniczna  ",
        sku: "  KB100  ",
        opis: "  Opis testowy  ",
        producent: "Keychron",
        kategoria: "Akcesoria",
        cechy: ["Nowość"],
        cenaNetto: "400.00",
        cenaBrutto: "492.00",
        vat: 23,
        waluta: "PLN",
        czyDostepny: true,
        czyLimitowany: true,
        iloscMagazyn: "25",
        minKoszyk: "1",
        maxKoszyk: "5",
      };

      const product = mapFormDataToProduct(formData);

      expect(product.nazwa).toBe("Klawiatura Mechaniczna");
      expect(product.sku).toBe("KB100");
      expect(product.opis).toBe("Opis testowy");
      expect(product.cenaNetto).toBe(400);
      expect(product.cenaBrutto).toBe(492);
      expect(product.iloscMagazyn).toBe(25);
      expect(product.minKoszyk).toBe(1);
      expect(product.maxKoszyk).toBe(5);
      expect(product.isNew).toBe(true);
      expect(product.id).toMatch(/^prod-/);
      expect(product.createdAt).toBeDefined();
    });

    it("ustawia iloscMagazyn na null, gdy produkt nie jest limitowany", () => {
      const formData: ProductFormData = {
        nazwa: "Usługa wdrożeniowa",
        sku: "SRV01",
        opis: "",
        producent: "Inny",
        kategoria: "Usługi",
        cechy: ["Promocja"],
        cenaNetto: "1000",
        cenaBrutto: "1230",
        vat: 23,
        waluta: "PLN",
        czyDostepny: true,
        czyLimitowany: false,
        iloscMagazyn: "100",
        minKoszyk: "1",
        maxKoszyk: "10",
      };

      const product = mapFormDataToProduct(formData);
      expect(product.iloscMagazyn).toBeNull();
    });
  });

  describe("mapZodErrors", () => {
    it("mapuje issues Zoda na płaski słownik błędów", () => {
      const parsed = step1Schema.safeParse({
        nazwa: "",
        sku: "",
        producent: "",
        kategoria: "",
        cechy: [],
      });

      if (!parsed.success) {
        const errorMap = mapZodErrors(parsed.error);
        expect(errorMap.nazwa).toBeDefined();
        expect(errorMap.sku).toBeDefined();
        expect(errorMap.cechy).toBeDefined();
      } else {
        throw new Error("Validation was expected to fail");
      }
    });
  });
});
