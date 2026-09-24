"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { StepIndicator } from "./step-indicator";
import { Step1Basic } from "./step-1-basic";
import { Step2Price } from "./step-2-price";
import { Step3Stock } from "./step-3-stock";
import { Product } from "@/lib/types";
import { useProductWizard } from "./use-product-wizard";
import { WIZARD_STEPS } from "./wizard-config";

interface ProductDialogProps {
  onAddProduct: (product: Product) => void;
}

export function ProductDialog({ onAddProduct }: ProductDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    form,
    currentStep,
    completedSteps,
    errors,
    clearFieldError,
    handleNextStep,
    handlePrevStep,
    handleSave,
    resetForm,
  } = useProductWizard({
    onAddProduct,
    onSuccess: () => setOpen(false),
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const isLastStep = currentStep === WIZARD_STEPS.length;

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="bg-brand hover:bg-brand-hover text-white font-medium rounded-full px-5 py-2 h-9 gap-2 shadow-xs transition-colors cursor-pointer"
      >
        <Plus className="h-4 w-4" />
        <span>Dodaj produkt</span>
      </Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="fixed inset-0 z-50 flex flex-col w-full h-dvh max-w-none rounded-none border-none bg-white dark:bg-card p-0 gap-0 overflow-hidden sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-[720px] sm:h-auto sm:max-h-[90vh] sm:rounded-[14px] sm:border sm:border-border-subtle sm:shadow-lg">
          {/* Header (64px, border-b border-border-subtle) */}
          <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-border-subtle">
            <DialogTitle className="text-base font-medium tracking-tight text-text-main">
              Dodaj nowy produkt
            </DialogTitle>
          </div>

          {/* Stepper (shrink-0) */}
          <div className="shrink-0">
            <StepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </div>

          {/* Zawartość bieżącego kroku */}
          <div className="flex-1 overflow-y-auto px-4 py-4 sm:py-5 sm:max-h-[calc(90vh-196px)]">
            {currentStep === 1 && (
              <Step1Basic
                form={form}
                errors={errors}
                clearError={clearFieldError}
              />
            )}

            {currentStep === 2 && (
              <Step2Price
                form={form}
                errors={errors}
                clearError={clearFieldError}
              />
            )}

            {currentStep === 3 && (
              <Step3Stock
                form={form}
                errors={errors}
                clearError={clearFieldError}
              />
            )}
          </div>

          {/* Stopka nawigacyjna (68px, bg-surface-subtle, border-border-subtle) */}
          <div className="h-[68px] shrink-0 flex items-center justify-between px-4 bg-white sm:bg-surface-subtle border-t border-border-subtle">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevStep}
                className="h-9 px-4 rounded-full border border-border-subtle bg-white dark:bg-card text-sm font-medium text-text-main hover:bg-muted cursor-pointer transition-colors gap-1.5 flex items-center"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Wstecz</span>
              </Button>
            ) : (
              <div />
            )}

            {!isLastStep ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="h-9 px-4 rounded-full bg-brand hover:bg-brand-hover text-sm font-medium text-white shadow-none transition-colors cursor-pointer gap-1.5 flex items-center"
              >
                <span>Dalej</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSave}
                className="h-9 px-5 rounded-full bg-brand hover:bg-brand-hover text-sm font-medium text-white shadow-none transition-colors cursor-pointer"
              >
                Zapisz produkt
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
