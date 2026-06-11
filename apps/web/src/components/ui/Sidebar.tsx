interface SidebarProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Sidebar({ children, style }: SidebarProps) {
  return (
    <div
      style={{
        padding: "1.25rem",
        borderRadius: "12px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        ...style,
      }}
    >
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">Categorias</a></li>
      </ul>
    </div>
  );
}
