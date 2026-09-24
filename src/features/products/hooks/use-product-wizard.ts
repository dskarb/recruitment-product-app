"use client";

import { useState, useCallback } from "react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Product } from "../types";
import { mapFormDataToProduct, mapZodErrors } from "../schemas";
import { DEFAULT_FORM_DATA, WIZARD_STEPS } from "../components/dialog/wizard-config";

interface UseProductWizardProps {
  onAddProduct: (product: Product) => void;
  onSuccess: () => void;
}

export function useProductWizard({
  onAddProduct,
  onSuccess,
}: UseProductWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const form = useForm({
    defaultValues: DEFAULT_FORM_DATA,
    onSubmit: async ({ value }) => {
      const newProduct = mapFormDataToProduct(value);
      onAddProduct(newProduct);
      toast.success("Produkt został dodany");
      resetForm();
      onSuccess();
    },
  });

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setCurrentStep(1);
    setCompletedSteps(new Set());
    setErrors({});
    form.reset();
  }, [form]);

  const handleNextStep = useCallback(() => {
    const stepConfig = WIZARD_STEPS.find((s) => s.step === currentStep);
    if (!stepConfig) return;

    const values = form.state.values;
    const result = stepConfig.schema.safeParse(values);

    if (!result.success) {
      setErrors(mapZodErrors(result.error));
      return;
    }

    setErrors({});
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((prev) => Math.min(prev + 1, WIZARD_STEPS.length));
  }, [currentStep, form]);

  const handlePrevStep = useCallback(() => {
    setErrors({});
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSave = useCallback(() => {
    // Sekwencyjna walidacja wszystkich kroków przed zapisem
    for (const step of WIZARD_STEPS) {
      const res = step.schema.safeParse(form.state.values);
      if (!res.success) {
        setErrors(mapZodErrors(res.error));
        setCurrentStep(step.step);
        return;
      }
    }

    setErrors({});
    form.handleSubmit();
  }, [form]);

  return {
    form,
    currentStep,
    completedSteps,
    errors,
    clearFieldError,
    handleNextStep,
    handlePrevStep,
    handleSave,
    resetForm,
  };
}

export type ProductFormInstance = ReturnType<typeof useProductWizard>["form"];
