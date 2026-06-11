interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

const styles: Record<string, React.CSSProperties> = {
  primary: {
    background: "var(--accent)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "transparent",
    color: "var(--text-primary)",
    border: "1px solid var(--border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "none",
  },
};

export function Button({ variant = "primary", children, style, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      style={{
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 500,
        fontSize: "0.875rem",
        opacity: disabled ? 0.7 : 1,
        transition: "opacity 0.2s",
        ...styles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
}
