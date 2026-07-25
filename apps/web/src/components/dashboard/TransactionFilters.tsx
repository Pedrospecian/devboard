interface TransactionFiltersProps {
  month: string;
  category: string;
  categories: string[];
  onMonthChange: (month: string) => void;
  onCategoryChange: (category: string) => void;
  onClear: () => void;
}

const selectStyle: React.CSSProperties = {
  padding: "0.4rem 0.75rem",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--bg-surface)",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  cursor: "pointer",
};

// Gera os últimos 12 meses no formato { label: "Jul 2026", value: "2026-07" }
function getLast12Months() {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short", year: "numeric" });
    return { value, label };
  });
}

export function TransactionFilters({
  month,
  category,
  categories,
  onMonthChange,
  onCategoryChange,
  onClear,
}: TransactionFiltersProps) {
  const months = getLast12Months();
  const hasActiveFilter = month || category;

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1rem" }}>
      <select value={month} onChange={(e) => onMonthChange(e.target.value)} style={selectStyle}>
        <option value="">All months</option>
        {months.map((m) => (
          <option key={m.value} value={m.value}>{m.label}</option>
        ))}
      </select>

      <select value={category} onChange={(e) => onCategoryChange(e.target.value)} style={selectStyle}>
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {hasActiveFilter && (
        <button
          onClick={onClear}
          style={{
            padding: "0.4rem 0.75rem",
            borderRadius: "8px",
            border: "1px solid var(--border)",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}