import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCards } from "@/components/dashboard/SummaryCards";

describe("SummaryCards", () => {
  it("shows incomes, expenses and balance formatted in BRL", () => {
    render(
      <SummaryCards
        summary={{ income: 5000, expense: 3200.5, balance: 1799.5 }}
      />
    );

    expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
    expect(screen.getByText("R$ 3.200,50")).toBeInTheDocument();
    expect(screen.getByText("R$ 1.799,50")).toBeInTheDocument();
  });

  it("shows the three expected labels", () => {
    render(<SummaryCards summary={{ income: 0, expense: 0, balance: 0 }} />);

    expect(screen.getByText("Month balance")).toBeInTheDocument();
    expect(screen.getByText("Incomes")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("properly renders negative balance", () => {
    render(
      <SummaryCards summary={{ income: 100, expense: 500, balance: -400 }} />
    );

    expect(screen.getByText("-R$ 400,00")).toBeInTheDocument();
  });
});
