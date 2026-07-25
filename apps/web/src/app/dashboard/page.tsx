"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSun } from "react-icons/fa6";
import { FaMoon } from "react-icons/fa";

import { useAuthStore } from "@/store/auth.store";
import { useThemeStore } from "@/store/theme.store";
import { Button } from "@/components/ui/Button";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { MonthlyChart } from "@/components/dashboard/MonthlyChart";
import { TransactionList } from "@/components/dashboard/TransactionList";
import { TransactionForm } from "@/components/dashboard/TransactionForm";
import {
  useSummary,
  useTransactions,
  useMonthlyChart,
  useCategories,
  useCreateTransaction,
  useDeleteTransaction,
} from "@/hooks/useTransactions";

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const { theme, toggle } = useThemeStore();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  const { data: summary } = useSummary();
  const { data: chartData = [] } = useMonthlyChart();
  const createTransaction = useCreateTransaction();
  const [filters, setFilters] = useState({ month: "", category: "" });
  const { data: transactions = [] } = useTransactions(filters);
  const { data: categories = [] } = useCategories();
  const deleteTransaction = useDeleteTransaction();

  if (!user) return null;

  async function handleCreate(form: any) {
    await createTransaction.mutateAsync(form);
    setShowForm(false);
  }

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "2rem" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <Button variant="secondary" onClick={toggle} title={theme === "light" ? "Dark Mode" : "Light Mode"}>
          {theme === "light" ? <FaMoon size={20} /> : <FaSun size={20} />}
        </Button>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>DevBoard</h1>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "0.875rem" }}>Olá, {user.name}</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <Button onClick={() => setShowForm(true)}>+ Nova transação</Button>
          <Button variant="secondary" onClick={handleLogout}>Sair</Button>
        </div>
      </div>

      {summary && <SummaryCards summary={summary} />}
      <MonthlyChart data={chartData} />
      <TransactionList
        transactions={transactions}
        categories={categories}
        onDelete={(id) => deleteTransaction.mutate(id)}
        onFilterChange={setFilters}
      />

      {showForm && (
        <TransactionForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}
    </main>
  );
}
