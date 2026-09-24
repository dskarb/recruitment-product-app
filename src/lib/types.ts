export const PRODUCERS = [
  "Apple",
  "Samsung",
  "Sony",
  "Bosch",
  "Xiaomi",
] as const;

export type Producer = (typeof PRODUCERS)[number];

export const CATEGORIES = [
  "Komputery",
  "Telefony",
  "RTV",
  "AGD",
  "Akcesoria",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const PRODUCT_FEATURES = [
  "Bluetooth",
  "WiFI",
  "USB-C",
  "Wodoodporny",
  "Bezprzewodowy",
  "Ekologiczny",
  "Premium",
] as const;

export type ProductFeature = (typeof PRODUCT_FEATURES)[number];

export const VAT_RATES = [
  { label: "23%", value: 23 },
  { label: "8%", value: 8 },
  { label: "5%", value: 5 },
  { label: "0%", value: 0 },
] as const;

export const CURRENCIES = ["PLN", "EUR", "USD", "GBP"] as const;
export type Currency = (typeof CURRENCIES)[number];

export interface Product {
  id: string;
  nazwa: string;
  sku: string;
  opis?: string;
  producent: string;
  kategoria: string;
  cechy: string[];
  cenaNetto: number;
  cenaBrutto: number;
  vat: number;
  waluta: Currency;
  czyDostepny: boolean;
  czyLimitowany: boolean;
  iloscMagazyn: number | null;
  minKoszyk: number;
  maxKoszyk: number;
  createdAt: string;
  isNew?: boolean;
}

export interface ProductFormData {
  // Step 1
  nazwa: string;
  sku: string;
  opis: string;
  producent: string;
  kategoria: string;
  cechy: string[];

  // Step 2
  cenaNetto: string | number;
  cenaBrutto: string | number;
  vat: number;
  waluta: Currency;

  // Step 3
  czyDostepny: boolean;
  czyLimitowany: boolean;
  iloscMagazyn: string | number;
  minKoszyk: string | number;
  maxKoszyk: string | number;
}
