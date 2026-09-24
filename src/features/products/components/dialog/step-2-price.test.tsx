import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Step2Price } from "./step-2-price";
import { useProductWizard } from "../../hooks/use-product-wizard";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function Step2Harness() {
  const { form, errors, clearFieldError } = useProductWizard({
    onAddProduct: vi.fn(),
    onSuccess: vi.fn(),
  });

  return (
    <Step2Price
      form={form}
      errors={errors}
      clearError={clearFieldError}
    />
  );
}

describe("components/product-dialog/Step2Price", () => {
  it("automatycznie przelicza kwotę brutto po wpisaniu kwoty netto (VAT 23%)", async () => {
    const user = userEvent.setup();
    render(<Step2Harness />);

    const nettoInput = screen.getByLabelText("Cena netto") as HTMLInputElement;
    const bruttoInput = screen.getByLabelText("Cena brutto") as HTMLInputElement;

    await user.type(nettoInput, "100");

    expect(nettoInput.value).toBe("100");
    expect(bruttoInput.value).toBe("123.00");
  });

  it("automatycznie przelicza kwotę netto po wpisaniu kwoty brutto", async () => {
    const user = userEvent.setup();
    render(<Step2Harness />);

    const nettoInput = screen.getByLabelText("Cena netto") as HTMLInputElement;
    const bruttoInput = screen.getByLabelText("Cena brutto") as HTMLInputElement;

    await user.type(bruttoInput, "246");

    expect(bruttoInput.value).toBe("246");
    expect(nettoInput.value).toBe("200.00");
  });

  it("poprawnie czyści i sanityzuje przecinek na kropkę", async () => {
    const user = userEvent.setup();
    render(<Step2Harness />);

    const nettoInput = screen.getByLabelText("Cena netto") as HTMLInputElement;
    const bruttoInput = screen.getByLabelText("Cena brutto") as HTMLInputElement;

    await user.type(nettoInput, "50,5");

    expect(nettoInput.value).toBe("50.5");
    expect(bruttoInput.value).toBe("62.12");
  });
});
