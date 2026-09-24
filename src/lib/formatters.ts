const plCurrencyFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatuje cenę z walutą zgodnie z polskimi standardami lokalizacji.
 */
export function formatPrice(price: number, currency: string): string {
  return `${plCurrencyFormatter.format(price)}\u00A0${currency}`;
}

/**
 * Odmienia słowo "produkt" w zależności od podanej liczby.
 * 1 -> 1 produkt
 * 2, 3, 4, 22, 23, 24... -> X produkty
 * 0, 5..21, 25..31... -> X produktów
 *
 * @param count Liczba produktów
 * @param withSuffix Czy dodać przyrostek "w katalogu"
 */
export function pluralizeProducts(count: number, withSuffix = false): string {
  const abs = Math.abs(count);
  const tens = abs % 100;
  const ones = abs % 10;

  let noun = "produktów";

  if (abs === 1) {
    noun = "produkt";
  } else if (tens < 10 || tens >= 20) {
    if (ones >= 2 && ones <= 4) {
      noun = "produkty";
    }
  }

  const base = `${count} ${noun}`;
  return withSuffix ? `${base} w katalogu` : base;
}
