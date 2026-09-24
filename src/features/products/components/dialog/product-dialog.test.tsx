import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductDialog } from "./product-dialog";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("components/product-dialog/ProductDialog", () => {
  it("renderuje przycisk otwierający dialog", () => {
    render(<ProductDialog onAddProduct={vi.fn()} />);
    expect(screen.getByRole("button", { name: /dodaj produkt/i })).toBeInTheDocument();
  });

  it("otwiera dialog po kliknięciu w przycisk", async () => {
    const user = userEvent.setup();
    render(<ProductDialog onAddProduct={vi.fn()} />);

    const openButton = screen.getByRole("button", { name: /dodaj produkt/i });
    await user.click(openButton);

    expect(screen.getByText("Dodaj nowy produkt")).toBeInTheDocument();
    expect(screen.getByText("Dane podstawowe")).toBeInTheDocument();
    expect(screen.getByLabelText(/nazwa produktu/i)).toBeInTheDocument();
  });

  it("wyświetla błędy walidacji po kliknięciu Dalej przy pustych polach", async () => {
    const user = userEvent.setup();
    render(<ProductDialog onAddProduct={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /dodaj produkt/i }));

    const nextButton = screen.getByRole("button", { name: /dalej/i });
    await user.click(nextButton);

    expect(
      await screen.findByText(/nazwa produktu musi mieć co najmniej 3 znaki/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sku produktu jest wymagane/i)
    ).toBeInTheDocument();
  });
});
