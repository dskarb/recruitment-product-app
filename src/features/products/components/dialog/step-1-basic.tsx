"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRODUCERS, CATEGORIES, PRODUCT_FEATURES } from "../../types";
import { cn } from "@/lib/utils";
import { ProductFormInstance } from "../../hooks/use-product-wizard";

interface Step1BasicProps {
  form: ProductFormInstance;
  errors: Record<string, string>;
  clearError: (field: string) => void;
}

export function Step1Basic({ form, errors, clearError }: Step1BasicProps) {
  return (
    <div className="space-y-4">
      {/* 2-kolumnowy layout dla Nazwy i SKU */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nazwa produktu */}
        <form.Field name="nazwa">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-text-main"
              >
                Nazwa produktu
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="np. MacBook Pro 14"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  field.handleChange(e.target.value);
                  clearError("nazwa");
                }}
                className={cn(
                  "border border-border-subtle text-sm",
                  errors.nazwa && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.nazwa && (
                <p className="text-xs text-destructive">{errors.nazwa}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* SKU produktu */}
        <form.Field name="sku">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-text-main"
              >
                SKU produktu
              </Label>
              <Input
                id={field.name}
                name={field.name}
                placeholder="np. MBP14M3PRO"
                value={field.state.value}
                maxLength={24}
                onBlur={field.handleBlur}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "");
                  field.handleChange(val);
                  clearError("sku");
                }}
                className={cn(
                  "border border-border-subtle text-sm",
                  errors.sku && "border-destructive focus-visible:ring-destructive"
                )}
              />
              {errors.sku && (
                <p className="text-xs text-destructive">{errors.sku}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Opis */}
      <form.Field name="opis">
        {(field) => (
          <div className="space-y-1.5">
            <Label
              htmlFor={field.name}
              className="text-sm font-medium text-text-main"
            >
              Opis produktu
            </Label>
            <Textarea
              id={field.name}
              name={field.name}
              placeholder="Krótki opis produktu"
              rows={3}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border border-border-subtle text-sm resize-none"
            />
          </div>
        )}
      </form.Field>

      {/* 2-kolumnowy layout dla Producenta i Kategorii */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Producent */}
        <form.Field name="producent">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-text-main"
              >
                Producent
              </Label>
              <Select
                value={field.state.value || null}
                onValueChange={(val) => {
                  if (val) {
                    field.handleChange(val);
                    clearError("producent");
                  }
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className={cn(
                    "w-full border border-border-subtle text-sm",
                    errors.producent && "border-destructive focus:ring-destructive"
                  )}
                >
                  <SelectValue placeholder="Wybierz producenta" />
                </SelectTrigger>
                <SelectContent>
                  {PRODUCERS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.producent && (
                <p className="text-xs text-destructive">{errors.producent}</p>
              )}
            </div>
          )}
        </form.Field>

        {/* Kategoria */}
        <form.Field name="kategoria">
          {(field) => (
            <div className="space-y-1.5">
              <Label
                htmlFor={field.name}
                className="text-sm font-medium text-text-main"
              >
                Kategoria
              </Label>
              <Select
                value={field.state.value || null}
                onValueChange={(val) => {
                  if (val) {
                    field.handleChange(val);
                    clearError("kategoria");
                  }
                }}
              >
                <SelectTrigger
                  id={field.name}
                  className={cn(
                    "w-full border border-border-subtle text-sm",
                    errors.kategoria && "border-destructive focus:ring-destructive"
                  )}
                >
                  <SelectValue placeholder="Wybierz kategorię" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategoria && (
                <p className="text-xs text-destructive">{errors.kategoria}</p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      {/* Cechy produktu (Badges / Tagi) */}
      <form.Field name="cechy">
        {(field) => {
          const toggleFeature = (feature: string) => {
            const current = field.state.value;
            const exists = current.includes(feature);
            const updated = exists
              ? current.filter((f) => f !== feature)
              : [...current, feature];
            field.handleChange(updated);
            clearError("cechy");
          };

          return (
            <div className="space-y-2 pt-1">
              <Label className="text-sm font-medium text-text-main">
                Cechy produktu
              </Label>
              <div className="flex flex-wrap gap-2 pt-1">
                {PRODUCT_FEATURES.map((feature) => {
                  const isSelected = field.state.value.includes(feature);
                  return (
                    <button
                      type="button"
                      key={feature}
                      onClick={() => toggleFeature(feature)}
                      className={cn(
                        "h-6 px-2 py-0.5 text-sm font-medium rounded-full transition-all select-none border inline-flex items-center cursor-pointer leading-none",
                        isSelected
                          ? "bg-brand text-white border-brand hover:bg-brand-hover"
                          : "bg-white dark:bg-card border-border-subtle text-text-subtle hover:border-text-main/30 hover:text-text-main"
                      )}
                    >
                      {feature}
                    </button>
                  );
                })}
              </div>
              {errors.cechy && (
                <p className="text-xs text-destructive mt-1.5">{errors.cechy}</p>
              )}
            </div>
          );
        }}
      </form.Field>
    </div>
  );
}
