import type { Transaction } from "@/components/dashboard/TransactionList";

export function exportTransactionsToCSV(transactions: Transaction[]) {
  if (transactions.length === 0) return;

  const headers = ["Title", "Amount", "Type", "Category", "Date"];

  const rows = transactions.map((t) => [
    `"${t.title.replace(/"/g, '""')}"`,
    t.amount.toString(),
    t.type,
    `"${t.category.replace(/"/g, '""')}"`,
    new Date(t.date).toLocaleDateString("pt-BR"),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}