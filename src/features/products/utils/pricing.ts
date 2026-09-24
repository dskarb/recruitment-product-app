/**
 * Sanityzuje ciąg znaków wprowadzany jako cena:
 * - Zamienia przecinki na kropki
 * - Usuwa wszystkie znaki poza cyframi i kropką
 * - Pozwala na maksymalnie jedną kropkę dziesiętną
 * - Ogranicza liczbę miejsc po przecinku do 2
 */
export function sanitizePriceInput(raw: string): string {
  let val = raw.replace(/,/g, ".");
  val = val.replace(/[^0-9.]/g, "");

  const dotIndex = val.indexOf(".");
  if (dotIndex !== -1) {
    val = val.slice(0, dotIndex + 1) + val.slice(dotIndex + 1).replace(/\./g, "");
  }

  if (dotIndex !== -1 && val.length - dotIndex - 1 > 2) {
    val = val.slice(0, dotIndex + 3);
  }

  return val;
}

/**
 * Wylicza kwotę brutto na podstawie ceny netto i stawki VAT (%).
 * brutto = netto * (1 + vat / 100)
 */
export function calculateBrutto(netto: number, vat: number): string {
  if (isNaN(netto) || netto < 0) return "";
  return (netto * (1 + vat / 100)).toFixed(2);
}

/**
 * Wylicza kwotę netto na podstawie ceny brutto i stawki VAT (%).
 * netto = brutto / (1 + vat / 100)
 */
export function calculateNetto(brutto: number, vat: number): string {
  if (isNaN(brutto) || brutto < 0) return "";
  return (brutto / (1 + vat / 100)).toFixed(2);
}
