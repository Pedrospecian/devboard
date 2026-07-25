import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  TransactionList,
  type Transaction,
} from "@/components/dashboard/TransactionList";

const baseTransactions: Transaction[] = [
  {
    id: "1",
    title: "Salary",
    amount: 5000,
    type: "INCOME",
    category: "Work",
    date: "2026-07-01",
  },
  {
    id: "2",
    title: "Rent",
    amount: 1500,
    type: "EXPENSE",
    category: "Housing",
    date: "2026-07-05",
  },
];

describe("TransactionList", () => {
  it("shows the 'empty list' message when there are no transactions", () => {
    render(<TransactionList transactions={[]} onDelete={vi.fn()} />);
    expect(screen.getByText("No transaction registered yet")).toBeInTheDocument();
  });

  it("renders one line for each transaction", () => {
    render(<TransactionList transactions={baseTransactions} onDelete={vi.fn()} />);

    expect(screen.getByText("Salary")).toBeInTheDocument();
    expect(screen.getByText("Rent")).toBeInTheDocument();
  });

  it("shows incomes with + sign and expenses with - sign", () => {
    render(<TransactionList transactions={baseTransactions} onDelete={vi.fn()} />);

    expect(screen.getByText("+R$ 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("-R$ 1.500,00")).toBeInTheDocument();
  });

  it("calls onDelete with the proper id when the Delete button is clicked", async () => {
    const user = userEvent.setup();
    const handleDelete = vi.fn();

    render(<TransactionList transactions={baseTransactions} onDelete={handleDelete} />);

    const deleteButtons = screen.getAllByTitle("Delete");
    await user.click(deleteButtons[0]);

    expect(handleDelete).toHaveBeenCalledWith("1");
  });
});
