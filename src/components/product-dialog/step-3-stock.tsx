"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ProductFormInstance } from "./use-product-wizard";

interface Step3StockProps {
  form: ProductFormInstance;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

export function Step3Stock({ form, errors, clearError }: Step3StockProps) {
  return (
    <div className="space-y-4">
      {/* Przełącznik: Czy produkt jest dostępny */}
      <form.Field name="czyDostepny">
        {(field) => (
          <div className="flex items-center space-x-3">
            <Switch
              id={field.name}
              checked={field.state.value}
              onCheckedChange={(checked) => field.handleChange(checked)}
            />
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-text-main cursor-pointer select-none"
            >
              Czy produkt jest dostępny
            </Label>
          </div>
        )}
      </form.Field>

      <div className="border-t border-border-subtle" />

      {/* Checkbox: Produkt limitowany */}
      <form.Field name="czyLimitowany">
        {(field) => {
          const isLimitowany = field.state.value;

          return (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={field.name}
                  checked={isLimitowany}
                  onCheckedChange={(checked) => {
                    const isChecked = !!checked;
                    field.handleChange(isChecked);
                    if (isChecked) {
                      if (!form.state.values.iloscMagazyn) {
                        form.setFieldValue("iloscMagazyn", "10");
                      }
                    } else {
                      form.setFieldValue("iloscMagazyn", "");
                      clearError("iloscMagazyn");
                    }
                  }}
                />
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main cursor-pointer select-none"
                >
                  Produkt limitowany
                </Label>
              </div>

              {/* Warunkowe pole: Ilość na magazynie (tylko gdy czyLimitowany) */}
              {isLimitowany && (
                <form.Field name="iloscMagazyn">
                  {(subField) => (
                    <div className="space-y-1.5 pt-1">
                      <Label
                        htmlFor={subField.name}
                        className="text-sm font-medium text-text-main"
                      >
                        Ilość na magazynie
                      </Label>
                      <Input
                        id={subField.name}
                        name={subField.name}
                        type="text"
                        inputMode="numeric"
                        placeholder="10"
                        value={subField.state.value}
                        onBlur={subField.handleBlur}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          subField.handleChange(val);
                          clearError("iloscMagazyn");
                        }}
                        className={cn(
                          "w-full border border-border-subtle text-sm",
                          errors.iloscMagazyn &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.iloscMagazyn && (
                        <p className="text-xs text-destructive">
                          {errors.iloscMagazyn}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
              )}
            </div>
          );
        }}
      </form.Field>

      <div className="border-t border-border-subtle" />

      {/* Sekcja: Limity koszyka */}
      <div className="space-y-3">
        <h4 className="text-base font-medium text-text-main">
          Limity koszyka
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Min ilość na koszyk */}
          <form.Field name="minKoszyk">
            {(field) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main"
                >
                  Minimalna ilość
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  placeholder="1"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    field.handleChange(val);
                    clearError("minKoszyk");
                    clearError("maxKoszyk");
                  }}
                  className={cn(
                    "border border-border-subtle text-sm",
                    errors.minKoszyk &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.minKoszyk && (
                  <p className="text-xs text-destructive">{errors.minKoszyk}</p>
                )}
              </div>
            )}
          </form.Field>

          {/* Maks ilość na koszyk */}
          <form.Field name="maxKoszyk">
            {(field) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor={field.name}
                  className="text-sm font-medium text-text-main"
                >
                  Maksymalna ilość
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  inputMode="numeric"
                  placeholder="10"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    field.handleChange(val);
                    clearError("minKoszyk");
                    clearError("maxKoszyk");
                  }}
                  className={cn(
                    "border border-border-subtle text-sm",
                    errors.maxKoszyk &&
                      "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {errors.maxKoszyk && (
                  <p className="text-xs text-destructive">{errors.maxKoszyk}</p>
                )}
              </div>
            )}
          </form.Field>
        </div>
      </div>
    </div>
  );
}
