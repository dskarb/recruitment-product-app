import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductPagination } from "./pagination";

describe("components/product-table/ProductPagination", () => {
  it("renderuje informacje o bieżącej stronie i liczbie produktów", () => {
    render(
      <ProductPagination
        currentPage={1}
        totalPages={4}
        totalItems={18}
        pageSize={5}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText(/Strona 1 z 4/)).toBeInTheDocument();
    expect(screen.getByText(/18 produktów/)).toBeInTheDocument();
  });

  it("blokuje przycisk Wstecz na pierwszej stronie", () => {
    render(
      <ProductPagination
        currentPage={1}
        totalPages={3}
        totalItems={12}
        pageSize={5}
        onPageChange={vi.fn()}
      />
    );

    const prevButton = screen.getByRole("button", { name: /poprzednia strona/i });
    expect(prevButton).toBeDisabled();

    const nextButton = screen.getByRole("button", { name: /następna strona/i });
    expect(nextButton).not.toBeDisabled();
  });

  it("blokuje przycisk Dalej na ostatniej stronie", () => {
    render(
      <ProductPagination
        currentPage={3}
        totalPages={3}
        totalItems={12}
        pageSize={5}
        onPageChange={vi.fn()}
      />
    );

    const nextButton = screen.getByRole("button", { name: /następna strona/i });
    expect(nextButton).toBeDisabled();

    const prevButton = screen.getByRole("button", { name: /poprzednia strona/i });
    expect(prevButton).not.toBeDisabled();
  });

  it("wywołuje onPageChange po kliknięciu numeru strony", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <ProductPagination
        currentPage={1}
        totalPages={3}
        totalItems={12}
        pageSize={5}
        onPageChange={handlePageChange}
      />
    );

    const page2Button = screen.getByRole("button", { name: "Strona 2" });
    await user.click(page2Button);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("wywołuje onPageChange po kliknięciu Dalej i Wstecz", async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <ProductPagination
        currentPage={2}
        totalPages={3}
        totalItems={12}
        pageSize={5}
        onPageChange={handlePageChange}
      />
    );

    const prevButton = screen.getByRole("button", { name: /poprzednia strona/i });
    const nextButton = screen.getByRole("button", { name: /następna strona/i });

    await user.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(1);

    await user.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it("oznacza aktywną stronę atrybutem aria-current='page'", () => {
    render(
      <ProductPagination
        currentPage={2}
        totalPages={3}
        totalItems={12}
        pageSize={5}
        onPageChange={vi.fn()}
      />
    );

    const page2Button = screen.getByRole("button", { name: "Strona 2" });
    expect(page2Button).toHaveAttribute("aria-current", "page");

    const page1Button = screen.getByRole("button", { name: "Strona 1" });
    expect(page1Button).not.toHaveAttribute("aria-current");
  });
});
