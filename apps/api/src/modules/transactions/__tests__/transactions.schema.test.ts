import { describe, it, expect } from "vitest";
import { createTransactionSchema } from "../transactions.schema";

describe("createTransactionSchema", () => {
  it("aceita um payload válido", () => {
    const result = createTransactionSchema.safeParse({
      title: "GroceriesGroceries",
      amount: 150.9,
      type: "EXPENSE",
      category: "Food",
      date: new Date().toISOString(),
    });

    expect(result.success).toBe(true);
  });

  it("rejeita título vazio", () => {
    const result = createTransactionSchema.safeParse({
      title: "",
      amount: 100,
      type: "EXPENSE",
      category: "Food",
      date: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });

  it("rejeita valor negativo ou zero", () => {
    for (const amount of [-10, 0]) {
      const result = createTransactionSchema.safeParse({
        title: "Groceries",
        amount,
        type: "EXPENSE",
        category: "Food",
        date: new Date().toISOString(),
      });
      expect(result.success).toBe(false);
    }
  });

  it("rejeita tipo fora de INCOME/EXPENSE", () => {
    const result = createTransactionSchema.safeParse({
      title: "Groceries",
      amount: 100,
      type: "TRANSFER",
      category: "Food",
      date: new Date().toISOString(),
    });

    expect(result.success).toBe(false);
  });

  it("rejeita data que não está em formato ISO datetime", () => {
    const result = createTransactionSchema.safeParse({
      title: "Groceries",
      amount: 100,
      type: "EXPENSE",
      category: "Food",
      date: "08/07/2026",
    });

    expect(result.success).toBe(false);
  });
});
