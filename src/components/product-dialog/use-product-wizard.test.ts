import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useProductWizard } from "./use-product-wizard";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("components/product-dialog/useProductWizard", () => {
  it("rozpoczyna z krokiem 1 i pustymi błędami", () => {
    const onAddProduct = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useProductWizard({ onAddProduct, onSuccess })
    );

    expect(result.current.currentStep).toBe(1);
    expect(result.current.completedSteps.size).toBe(0);
    expect(Object.keys(result.current.errors).length).toBe(0);
  });

  it("blokuje przejście do kroku 2 przy pustych/niepoprawnych danych kroku 1", () => {
    const onAddProduct = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useProductWizard({ onAddProduct, onSuccess })
    );

    act(() => {
      result.current.handleNextStep();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.errors.nazwa).toBeDefined();
    expect(result.current.errors.sku).toBeDefined();
    expect(result.current.completedSteps.has(1)).toBe(false);
  });

  it("pozwala na przejście do kroku 2 po wypełnieniu wymaganych pól kroku 1", () => {
    const onAddProduct = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useProductWizard({ onAddProduct, onSuccess })
    );

    act(() => {
      result.current.form.setFieldValue("nazwa", "Mysz bezprzewodowa");
      result.current.form.setFieldValue("sku", "MOUSE123");
      result.current.form.setFieldValue("producent", "Logitech");
      result.current.form.setFieldValue("kategoria", "Peryferia");
      result.current.form.setFieldValue("cechy", ["Bestseller"]);
    });

    act(() => {
      result.current.handleNextStep();
    });

    expect(result.current.currentStep).toBe(2);
    expect(Object.keys(result.current.errors).length).toBe(0);
    expect(result.current.completedSteps.has(1)).toBe(true);
  });

  it("cofa się do poprzedniego kroku za pomocą handlePrevStep", () => {
    const onAddProduct = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useProductWizard({ onAddProduct, onSuccess })
    );

    act(() => {
      result.current.form.setFieldValue("nazwa", "Mysz bezprzewodowa");
      result.current.form.setFieldValue("sku", "MOUSE123");
      result.current.form.setFieldValue("producent", "Logitech");
      result.current.form.setFieldValue("kategoria", "Peryferia");
      result.current.form.setFieldValue("cechy", ["Bestseller"]);
    });

    act(() => {
      result.current.handleNextStep();
    });
    expect(result.current.currentStep).toBe(2);

    act(() => {
      result.current.handlePrevStep();
    });
    expect(result.current.currentStep).toBe(1);
  });

  it("podczas handleSave waliduje wszystkie kroki i przeskakuje do pierwszego błędnego", () => {
    const onAddProduct = vi.fn();
    const onSuccess = vi.fn();

    const { result } = renderHook(() =>
      useProductWizard({ onAddProduct, onSuccess })
    );

    // Próba zapisu przy pustym formularzu
    act(() => {
      result.current.handleSave();
    });

    expect(result.current.currentStep).toBe(1);
    expect(result.current.errors.nazwa).toBeDefined();
    expect(onAddProduct).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });
});
