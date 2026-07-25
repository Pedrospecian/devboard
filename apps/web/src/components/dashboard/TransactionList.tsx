"use client";

import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TransactionFilters } from "@/components/dashboard/TransactionFilters";
import { exportTransactionsToCSV } from "@/lib/exportCsv";

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  categories: string[];
  onDelete: (id: string) => void;
  onFilterChange: (filters: { month: string; category: string }) => void;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function TransactionList({
  transactions,
  categories,
  onDelete,
  onFilterChange,
}: TransactionListProps) {
  const [month, setMonth] = useState("");
  const [category, setCategory] = useState("");

  function handleMonthChange(value: string) {
    setMonth(value);
    onFilterChange({ month: value, category });
  }

  function handleCategoryChange(value: string) {
    setCategory(value);
    onFilterChange({ month, category: value });
  }

  function handleClear() {
    setMonth("");
    setCategory("");
    onFilterChange({ month: "", category: "" });
  }

  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>
          Recent transactions
        </h2>
        {transactions.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => exportTransactionsToCSV(transactions)}
            title="Export to CSV"
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}
          >
            <FaDownload size={14} />
            Export CSV
          </Button>
        )}
      </div>

      <TransactionFilters
        month={month}
        category={category}
        categories={categories}
        onMonthChange={handleMonthChange}
        onCategoryChange={handleCategoryChange}
        onClear={handleClear}
      />

      {transactions.length === 0 ? (
        <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>
          No transaction registered yet
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {transactions.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem",
                borderRadius: "8px",
                background: "var(--bg-subtle)",
              }}
            >
              <div>
                <p style={{ margin: 0, fontWeight: 500 }}>{t.title}</p>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  {t.category} · {new Date(t.date).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{ fontWeight: 600, color: t.type === "INCOME" ? "var(--income)" : "var(--expense)" }}>
                  {t.type === "INCOME" ? "+" : "-"}{fmt(t.amount)}
                </span>
                <Button variant="ghost" onClick={() => onDelete(t.id)} title="Delete" style={{ color: "var(--text-muted)" }}>
                  <FaRegTrashAlt size={20} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}