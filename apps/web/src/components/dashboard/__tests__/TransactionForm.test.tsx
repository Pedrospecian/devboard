import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransactionForm } from "@/components/dashboard/TransactionForm";

describe("TransactionForm", () => {
  it("calls onClose when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();

    render(<TransactionForm onSubmit={vi.fn()} onClose={handleClose} />);
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("sends the data filled by the user via onSubmit", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<TransactionForm onSubmit={handleSubmit} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Title"), "Groceries");
    await user.type(screen.getByLabelText("Value (R$)"), "150.90");
    await user.type(screen.getByLabelText("Category"), "Food");
    await user.selectOptions(screen.getByRole("combobox"), "EXPENSE");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Groceries",
        amount: "150.9",
        category: "Food",
        type: "EXPENSE",
      })
    );
  });

  it("show 'Saving...' and disables the button when onSubmit is pending", async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const handleSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<TransactionForm onSubmit={handleSubmit} onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Title"), "Test");
    await user.type(screen.getByLabelText("Value (R$)"), "10");
    await user.type(screen.getByLabelText("Category"), "Test");

    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(screen.getByRole("button", { name: "Saving..." })).toBeDisabled();

    resolveSubmit!();
  });
});
