import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

vi.mock("../../../lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

import {
  getSummary,
  createTransaction,
  deleteTransaction,
} from "../transactions.service";

describe("transactions.service", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe("getSummary", () => {
    it("soma receitas e despesas do mês e calcula o saldo", async () => {
      prismaMock.transaction.findMany.mockResolvedValue([
        { type: "INCOME", amount: 5000 },
        { type: "EXPENSE", amount: 1200 },
        { type: "EXPENSE", amount: 300 },
      ] as any);

      const result = await getSummary("user-1");

      expect(result).toEqual({ income: 5000, expense: 1500, balance: 3500 });
    });

    it("retorna zeros quando não há transações no mês", async () => {
      prismaMock.transaction.findMany.mockResolvedValue([]);

      const result = await getSummary("user-1");

      expect(result).toEqual({ income: 0, expense: 0, balance: 0 });
    });

    it("filtra apenas transações do usuário informado", async () => {
      prismaMock.transaction.findMany.mockResolvedValue([]);

      await getSummary("user-42");

      expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ userId: "user-42" }),
        })
      );
    });
  });

  describe("createTransaction", () => {
    it("envia os dados corretos para o Prisma, convertendo a data", async () => {
      prismaMock.transaction.create.mockResolvedValue({} as any);

      await createTransaction("user-1", {
        title: "Mercado",
        amount: 150.9,
        type: "EXPENSE",
        category: "Alimentação",
        date: "2026-07-08T00:00:00.000Z",
      });

      expect(prismaMock.transaction.create).toHaveBeenCalledWith({
        data: {
          userId: "user-1",
          title: "Mercado",
          amount: 150.9,
          type: "EXPENSE",
          category: "Alimentação",
          date: new Date("2026-07-08T00:00:00.000Z"),
        },
      });
    });
  });

  describe("deleteTransaction", () => {
    it("só permite excluir uma transação que pertence ao usuário", async () => {
      prismaMock.transaction.deleteMany.mockResolvedValue({ count: 1 });

      await deleteTransaction("user-1", "transaction-9");

      expect(prismaMock.transaction.deleteMany).toHaveBeenCalledWith({
        where: { id: "transaction-9", userId: "user-1" },
      });
    });
  });
});
