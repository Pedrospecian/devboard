import { prisma } from "../../lib/prisma";
import type { CreateTransactionInput } from "./transactions.schema";

interface TransactionFilters {
  month?: string; // formato: "2026-05"
  category?: string;
}

export async function getTransactions(userId: string, filters: TransactionFilters = {}) {
  const where: any = { userId };

  if (filters.month) {
    const [year, month] = filters.month.split("-").map(Number);
    where.date = {
      gte: new Date(year, month - 1, 1),
      lt: new Date(year, month, 1),
    };
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: "insensitive" };
  }

  return prisma.transaction.findMany({
    where,
    orderBy: { date: "desc" },
    take: 50,
  });
}

export async function getSummary(userId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const transactions = await prisma.transaction.findMany({
    where: { userId, date: { gte: startOfMonth } },
  });

  const income = transactions
    .filter((t: { type: string }) => t.type === "INCOME")
    .reduce((sum: number, t: { amount: unknown }) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t: { type: string }) => t.type === "EXPENSE")
    .reduce((sum: number, t: { amount: unknown }) => sum + Number(t.amount), 0);

  return { income, expense, balance: income - expense };
}

export async function getMonthlyChart(userId: string) {
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return { year: d.getFullYear(), month: d.getMonth() };
  }).reverse();

  const result = await Promise.all(
    months.map(async ({ year, month }) => {
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);

      const transactions = await prisma.transaction.findMany({
        where: { userId, date: { gte: start, lt: end } },
      });

      const income = transactions
        .filter((t: { type: string }) => t.type === "INCOME")
        .reduce((sum: number, t: { amount: unknown }) => sum + Number(t.amount), 0);

      const expense = transactions
        .filter((t: { type: string }) => t.type === "EXPENSE")
        .reduce((sum: number, t: { amount: unknown }) => sum + Number(t.amount), 0);

      return {
        month: start.toLocaleString("pt-BR", { month: "short" }),
        income,
        expense,
      };
    })
  );

  return result;
}

export async function createTransaction(
  userId: string,
  input: CreateTransactionInput
) {
  return prisma.transaction.create({
    data: {
      userId,
      title: input.title,
      amount: input.amount,
      type: input.type,
      category: input.category,
      date: new Date(input.date),
    },
  });
}

export async function deleteTransaction(userId: string, id: string) {
  return prisma.transaction.deleteMany({ where: { id, userId } });
}