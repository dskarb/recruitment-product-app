import { ProductFormData } from "../../types";
import { step1Schema, step2Schema, step3Schema } from "../../schemas";
import { z } from "zod";

export interface WizardStepItem {
  step: number;
  title: string;
  subtitle: string;
  schema: z.ZodTypeAny;
}

export const WIZARD_STEPS = [
  { step: 1, title: "Informacje", subtitle: "Dane podstawowe", schema: step1Schema },
  { step: 2, title: "Cena", subtitle: "Dane cenowe", schema: step2Schema },
  { step: 3, title: "Dostępność", subtitle: "Stany magazynowe", schema: step3Schema },
] as const satisfies readonly WizardStepItem[];

export const DEFAULT_FORM_DATA: ProductFormData = {
  nazwa: "",
  sku: "",
  opis: "",
  producent: "",
  kategoria: "",
  cechy: [],
  cenaNetto: "",
  cenaBrutto: "",
  vat: 23,
  waluta: "PLN",
  czyDostepny: true,
  czyLimitowany: false,
  iloscMagazyn: "",
  minKoszyk: "1",
  maxKoszyk: "5",
};
