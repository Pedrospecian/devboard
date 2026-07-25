"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { useThemeStore } from "@/store/theme.store";

interface ChartPoint {
  month: string;
  income: number;
  expense: number;
}

interface MonthlyChartProps {
  data: ChartPoint[];
}

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const palette = {
  light: {
    income: "#16a34a",
    expense: "#dc2626",
    incomeHover: "#15803d",
    expenseHover: "#b91c1c",
    tooltipBg: "#ffffff",
    tooltipBorder: "#e5e5e5",
    tooltipText: "#111111",
    axisText: "#666666",
    cursor: "rgba(0,0,0,0.04)",
  },
  dark: {
    income: "#22c55e",
    expense: "#f87171",
    incomeHover: "#16a34a",
    expenseHover: "#ef4444",
    tooltipBg: "#1a1a1a",
    tooltipBorder: "#2e2e2e",
    tooltipText: "#f1f1f1",
    axisText: "#a0a0a0",
    cursor: "rgba(255,255,255,0.04)",
  },
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
  colors: typeof palette.light;
}

function CustomTooltip({ active, payload, label, colors }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
        borderRadius: "8px",
        padding: "0.75rem 1rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <p style={{ margin: "0 0 0.5rem", fontWeight: 600, color: colors.tooltipText, fontSize: "0.875rem" }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ margin: "0.25rem 0", fontSize: "0.875rem", color: entry.color }}>
          {entry.name}: {fmt(entry.value)}
        </p>
      ))}
    </div>
  );
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const { theme } = useThemeStore();
  const colors = palette[theme];

  return (
    <Card style={{ marginBottom: "2rem" }}>
      <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem" }}>
        Últimos 6 meses
      </h2>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} style={{ cursor: "default" }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: colors.axisText }}
            axisLine={{ stroke: colors.tooltipBorder }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: colors.axisText }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip colors={colors} />}
            cursor={{ fill: colors.cursor }}
          />
          <Legend
            wrapperStyle={{ fontSize: "0.875rem", color: colors.axisText }}
          />
          <Bar
            dataKey="income"
            name="Incomes"
            fill={colors.income}
            activeBar={{ fill: colors.incomeHover }}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill={colors.expense}
            activeBar={{ fill: colors.expenseHover }}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}