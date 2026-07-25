import { Card } from "@/components/ui/Card";

interface Summary {
  income: number;
  expense: number;
  balance: number;
}

interface SummaryCardsProps {
  summary: Summary;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function SummaryCards({ summary }: SummaryCardsProps) {
  const cards = [
    {
      label: "Month balance",
      value: summary.balance,
      color: summary.balance >= 0 ? "var(--income)" : "var(--expense)",
    },
    {
      label: "Incomes",
      value: summary.income,
      color: "var(--income)",
    },
    {
      label: "Expenses",
      value: summary.expense,
      color: "var(--expense)",
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      {cards.map(({ label, value, color }) => (
        <Card key={label}>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
            {label}
          </p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600, color }}>
            {fmt(value)}
          </p>
        </Card>
      ))}
    </div>
  );
}
