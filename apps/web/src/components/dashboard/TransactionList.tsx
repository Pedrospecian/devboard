import { FaRegTrashAlt } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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
  onDelete: (id: string) => void;
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
  return (
    <Card>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem" }}>
        Transações recentes
      </h2>

      {transactions.length === 0 ? (
        <p style={{ color: "#999", textAlign: "center", padding: "2rem 0" }}>
          Nenhuma transação ainda
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
                <span
                  style={{
                    fontWeight: 600,
                    color: t.type === "INCOME" ? "var(--income)" : "var(--expense)",
                  }}
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  {fmt(t.amount)}
                </span>
                <Button variant="ghost" onClick={() => onDelete(t.id)} title={"Excluir"} style={{ color: "var(--text-muted)" }}>
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
