"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme.store";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { toggle } = useThemeStore();

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved === "dark") toggle();
  }, []);

  return <>{children}</>;
}