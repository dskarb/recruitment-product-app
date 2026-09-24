import { z } from "zod";
import { CURRENCIES } from "./types";

export const step1Schema = z.object({
  nazwa: z
    .string()
    .trim()
    .min(3, "Nazwa produktu musi mieć co najmniej 3 znaki")
    .max(120, "Nazwa produktu może mieć maksymalnie 120 znaków"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU produktu jest wymagane")
    .max(24, "SKU produktu może mieć maksymalnie 24 znaki")
    .regex(/^[a-zA-Z0-9]+$/, "SKU może zawierać wyłącznie litery i cyfry"),
  opis: z
    .string()
    .trim()
    .max(1000, "Opis produktu może mieć maksymalnie 1000 znaków")
    .optional()
    .default(""),
  producent: z.string().min(1, "Wybierz producenta"),
  kategoria: z.string().min(1, "Wybierz kategorię"),
  cechy: z
    .array(z.string())
    .min(1, "Wybierz co najmniej jedną cechę produktu"),
});

function createPriceSchema(label: string) {
  return z
    .union([z.string(), z.number()])
    .superRefine((val, ctx) => {
      const strVal = String(val).trim();
      if (!strVal) {
        ctx.addIssue({
          code: "custom",
          message: `${label} jest wymagana`,
        });
        return;
      }
      const num = typeof val === "string" ? parseFloat(val.replace(",", ".")) : Number(val);
      if (isNaN(num) || num <= 0) {
        ctx.addIssue({
          code: "custom",
          message: `${label} musi być większa od 0`,
        });
      } else if (num > 10_000_000) {
        ctx.addIssue({
          code: "custom",
          message: `${label} nie może przekraczać 10 000 000`,
        });
      }
    });
}

function createQuantitySchema(label: string, min = 1, max = 9999) {
  return z
    .union([z.string(), z.number()])
    .superRefine((val, ctx) => {
      const strVal = String(val).trim();
      if (!strVal) {
        ctx.addIssue({
          code: "custom",
          message: `${label} jest wymagana`,
        });
        return;
      }
      const num = typeof val === "string" ? parseInt(val, 10) : Math.floor(Number(val));
      if (isNaN(num) || num < min) {
        ctx.addIssue({
          code: "custom",
          message: `${label} musi wynosić co najmniej ${min}`,
        });
      } else if (num > max) {
        ctx.addIssue({
          code: "custom",
          message: `${label} nie może przekraczać ${max}`,
        });
      }
    });
}

export const step2Schema = z
  .object({
    cenaNetto: createPriceSchema("Cena netto"),
    cenaBrutto: createPriceSchema("Cena brutto"),
    vat: z.coerce.number().min(0, "Wybierz stawkę VAT"),
    waluta: z.enum(CURRENCIES),
  })
  .superRefine((data, ctx) => {
    const nettoNum =
      typeof data.cenaNetto === "string"
        ? parseFloat(data.cenaNetto.replace(",", "."))
        : Number(data.cenaNetto);
    const bruttoNum =
      typeof data.cenaBrutto === "string"
        ? parseFloat(data.cenaBrutto.replace(",", "."))
        : Number(data.cenaBrutto);

    if (!isNaN(nettoNum) && nettoNum > 0 && !isNaN(bruttoNum) && bruttoNum > 0) {
      const expectedBrutto = nettoNum * (1 + data.vat / 100);
      if (Math.abs(bruttoNum - expectedBrutto) > 0.05) {
        ctx.addIssue({
          code: "custom",
          message: "Cena brutto jest niespójna z ceną netto i stawką VAT",
          path: ["cenaBrutto"],
        });
      }
    }
  });

export const step3Schema = z
  .object({
    czyDostepny: z.boolean().default(true),
    czyLimitowany: z.boolean().default(false),
    iloscMagazyn: z
      .union([z.string(), z.number()])
      .optional()
      .transform((val) => {
        if (val === "" || val === undefined || val === null) return undefined;
        return typeof val === "string" ? parseInt(val, 10) : Math.floor(val);
      }),
    minKoszyk: createQuantitySchema("Minimalna ilość"),
    maxKoszyk: createQuantitySchema("Maksymalna ilość"),
  })
  .superRefine((data, ctx) => {
    // Jeśli limitowany, iloscMagazyn jest wymagane i musi być nieujemne
    if (data.czyLimitowany) {
      if (data.iloscMagazyn === undefined || isNaN(data.iloscMagazyn)) {
        ctx.addIssue({
          code: "custom",
          message: "Podaj ilość na magazynie dla produktu limitowanego",
          path: ["iloscMagazyn"],
        });
      } else if (data.iloscMagazyn < 0) {
        ctx.addIssue({
          code: "custom",
          message: "Ilość na magazynie nie może być ujemna",
          path: ["iloscMagazyn"],
        });
      } else if (data.iloscMagazyn > 1_000_000) {
        ctx.addIssue({
          code: "custom",
          message: "Ilość na magazynie nie może przekraczać 1 000 000",
          path: ["iloscMagazyn"],
        });
      }
    }

    // Min ilość nie może przekraczać Max ilości
    const minNum = typeof data.minKoszyk === "string" ? parseInt(data.minKoszyk, 10) : Number(data.minKoszyk);
    const maxNum = typeof data.maxKoszyk === "string" ? parseInt(data.maxKoszyk, 10) : Number(data.maxKoszyk);
    if (!isNaN(minNum) && !isNaN(maxNum)) {
      if (minNum > maxNum) {
        ctx.addIssue({
          code: "custom",
          message: "Minimalna ilość nie może być większa niż maksymalna",
          path: ["minKoszyk"],
        });
        ctx.addIssue({
          code: "custom",
          message: "Maksymalna ilość nie może być mniejsza niż minimalna",
          path: ["maxKoszyk"],
        });
      }
    }
  });

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type Step3FormData = z.infer<typeof step3Schema>;

import { Product, ProductFormData } from "./types";

/**
 * Konwertuje błędy ZodIssue do płaskiego słownika błędów pól { [pole]: komunikat }
 */
export function mapZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path[0] as string;
    if (field && !fieldErrors[field]) {
      fieldErrors[field] = issue.message;
    }
  }
  return fieldErrors;
}

/**
 * Bezpiecznie mapuje zweryfikowane dane formularza na encję domeny Product.
 */
export function mapFormDataToProduct(data: ProductFormData): Product {
  const nettoNum =
    typeof data.cenaNetto === "string"
      ? parseFloat(data.cenaNetto.replace(",", "."))
      : Number(data.cenaNetto);

  const bruttoNum =
    typeof data.cenaBrutto === "string"
      ? parseFloat(data.cenaBrutto.replace(",", "."))
      : Number(data.cenaBrutto);

  const iloscMagazynVal = data.czyLimitowany
    ? typeof data.iloscMagazyn === "string"
      ? parseInt(data.iloscMagazyn, 10)
      : Number(data.iloscMagazyn)
    : null;

  const minKoszykVal =
    typeof data.minKoszyk === "string"
      ? parseInt(data.minKoszyk, 10)
      : Number(data.minKoszyk);

  const maxKoszykVal =
    typeof data.maxKoszyk === "string"
      ? parseInt(data.maxKoszyk, 10)
      : Number(data.maxKoszyk);

  return {
    id: "prod-" + (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now()),
    nazwa: data.nazwa.trim(),
    sku: data.sku.trim(),
    opis: data.opis.trim() || undefined,
    producent: data.producent,
    kategoria: data.kategoria,
    cechy: data.cechy,
    cenaNetto: isNaN(nettoNum) ? 0 : nettoNum,
    cenaBrutto: isNaN(bruttoNum) ? 0 : bruttoNum,
    vat: data.vat,
    waluta: data.waluta,
    czyDostepny: data.czyDostepny,
    czyLimitowany: data.czyLimitowany,
    iloscMagazyn: iloscMagazynVal !== null && !isNaN(iloscMagazynVal) ? iloscMagazynVal : null,
    minKoszyk: isNaN(minKoszykVal) ? 1 : minKoszykVal,
    maxKoszyk: isNaN(maxKoszykVal) ? 1 : maxKoszykVal,
    createdAt: new Date().toISOString(),
    isNew: true,
  };
}

