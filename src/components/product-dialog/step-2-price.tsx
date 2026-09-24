"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, VAT_RATES, Currency } from "@/lib/types";
import { cn } from "@/lib/utils";
import { calculateBrutto, calculateNetto, sanitizePriceInput } from "@/lib/pricing";
import { ProductFormInstance } from "./use-product-wizard";

interface Step2PriceProps {
  form: ProductFormInstance;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

export function Step2Price({ form, errors, clearError }: Step2PriceProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Cena netto */}
        <form.Field name="cenaNetto">
          {(field) => {
            const handleNettoChange = (valStr: string) => {
              clearError("cenaNetto");
              clearError("cenaBrutto");

              const cleaned = sanitizePriceInput(valStr);
              field.handleChange(cleaned);

              if (cleaned === "") {
                form.setFieldValue("cenaBrutto", "");
                return;
              }

              const parsed = parseFloat(cleaned);
              if (!isNaN(parsed) && parsed >= 0) {
                const currentVat = form.state.values.vat;
                const bruttoVal = calculateBrutto(parsed, currentVat);
                form.setFieldValue("cenaBrutto", bruttoVal);
              }
            };

            return (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main"
                >
                  Cena netto
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => handleNettoChange(e.target.value)}
                  className={cn(
                    "border border-border-subtle text-sm",
                    errors.cenaNetto && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.cenaNetto && (
                  <p className="text-xs text-destructive">{errors.cenaNetto}</p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Cena brutto */}
        <form.Field name="cenaBrutto">
          {(field) => {
            const handleBruttoChange = (valStr: string) => {
              clearError("cenaNetto");
              clearError("cenaBrutto");

              const cleaned = sanitizePriceInput(valStr);
              field.handleChange(cleaned);

              if (cleaned === "") {
                form.setFieldValue("cenaNetto", "");
                return;
              }

              const parsed = parseFloat(cleaned);
              if (!isNaN(parsed) && parsed >= 0) {
                const currentVat = form.state.values.vat;
                const nettoVal = calculateNetto(parsed, currentVat);
                form.setFieldValue("cenaNetto", nettoVal);
              }
            };

            return (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main"
                >
                  Cena brutto
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => handleBruttoChange(e.target.value)}
                  className={cn(
                    "border border-border-subtle text-sm",
                    errors.cenaBrutto && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.cenaBrutto && (
                  <p className="text-xs text-destructive">{errors.cenaBrutto}</p>
                )}
              </div>
            );
          }}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Stawka VAT */}
        <form.Field name="vat">
          {(field) => {
            const handleVatChange = (vatStr: string | null) => {
              if (!vatStr) return;
              const newVat = Number(vatStr);
              if (isNaN(newVat)) return;
              field.handleChange(newVat);
              clearError("vat");

              const nettoStr = String(form.state.values.cenaNetto);
              const nettoNum = parseFloat(nettoStr);

              if (!isNaN(nettoNum) && nettoNum > 0) {
                const bruttoVal = calculateBrutto(nettoNum, newVat);
                form.setFieldValue("cenaBrutto", bruttoVal);
              } else {
                const bruttoStr = String(form.state.values.cenaBrutto);
                const bruttoNum = parseFloat(bruttoStr);
                if (!isNaN(bruttoNum) && bruttoNum > 0) {
                  const nettoVal = calculateNetto(bruttoNum, newVat);
                  form.setFieldValue("cenaNetto", nettoVal);
                }
              }
            };

            return (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main"
                >
                  Stawka VAT
                </Label>
                <Select
                  value={
                    field.state.value !== undefined && field.state.value !== null
                      ? String(field.state.value)
                      : "23"
                  }
                  onValueChange={handleVatChange}
                >
                  <SelectTrigger
                    id={field.name}
                    className={cn(
                      "w-full border border-border-subtle text-sm",
                      errors.vat && "border-destructive focus:ring-destructive"
                    )}
                  >
                    <SelectValue placeholder="23%" />
                  </SelectTrigger>
                  <SelectContent>
                    {VAT_RATES.map((rate) => (
                      <SelectItem key={rate.value} value={String(rate.value)}>
                        {rate.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vat && <p className="text-xs text-destructive">{errors.vat}</p>}
              </div>
            );
          }}
        </form.Field>

        {/* Waluta */}
        <form.Field name="waluta">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-text-main"
              >
                Waluta
              </Label>
              <Select
                value={field.state.value || "PLN"}
                onValueChange={(val) => {
                  if (val) {
                    field.handleChange(val as Currency);
                    clearError("waluta");
                  }
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className={cn(
                    "w-full border border-border-subtle text-sm",
                    errors.waluta && "border-destructive focus:ring-destructive"
                  )}
                >
                  <SelectValue placeholder="PLN" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((cur) => (
                    <SelectItem key={cur} value={cur}>
                      {cur}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.waluta && (
                <p className="text-xs text-destructive">{errors.waluta}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>
    </div>
  );
}
