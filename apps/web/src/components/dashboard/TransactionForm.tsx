"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FormState {
  title: string;
  amount: string;
  type: string;
  category: string;
  date: string;
}

interface TransactionFormProps {
  onSubmit: (data: FormState) => Promise<void>;
  onClose: () => void;
}

const initialForm: FormState = {
  title: "",
  amount: "",
  type: "EXPENSE",
  category: "",
  date: new Date().toISOString().slice(0, 10),
};

const fields = [
  { label: "Title", key: "title", type: "text" },
  { label: "Value (R$)", key: "amount", type: "number" },
  { label: "Category", key: "category", type: "text" },
  { label: "Date", key: "date", type: "date" },
] as const;

export function TransactionForm({ onSubmit, onClose }: TransactionFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);

  function handleChange(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "var(--bg-surface)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ margin: "0 0 1.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
          New transaction
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {fields.map(({ label, key, type }) => (
            <div key={key}>
              <label htmlFor={`transaction-${key}`} style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{label}</label>
              <input
                id={`transaction-${key}`}
                type={type}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                required
                min={type === "number" ? "0.01" : undefined}
                step={type === "number" ? "0.01" : undefined}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.25rem",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "1rem",
                  boxSizing: "border-box",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  colorScheme: "var(--color-scheme)",
                }}
              />
            </div>
          ))}

          <div>
            <label htmlFor="transaction-type" style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Type</label>
            <select
              id="transaction-type"
              value={form.type}
              onChange={(e) => handleChange("type", e.target.value)}
              style={{
                display: "block",
                width: "100%",
                padding: "0.5rem",
                marginTop: "0.25rem",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "1rem",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                colorScheme: "var(--color-scheme)",
              }}
            >
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              style={{ flex: 1, padding: "0.75rem" }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: "0.75rem" }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
