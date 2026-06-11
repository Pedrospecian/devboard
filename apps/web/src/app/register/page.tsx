"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/auth/register", { name, email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-subtle)" }}>
      <div style={{ background: "var(--bg-surface)", padding: "2rem", borderRadius: "12px", border: "1px solid var(--border)", width: "100%", maxWidth: "400px" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1.5rem" }}>Criar conta</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
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

          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ display: "block", width: "100%", padding: "0.5rem", marginTop: "0.25rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          {error && <p style={{ color: "var(--expense)", fontSize: "0.875rem" }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.75rem", background: "var(--accent)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "1rem", cursor: "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Cadastrando..." : "Criar conta"}
          </button>
        </form>

        <p style={{ marginTop: "1rem", fontSize: "0.875rem", textAlign: "center", color: "var(--text-secondary)" }}>
          Já tem conta?{" "}
          <a href="/login" style={{ color: "var(--accent)" }}>Entrar</a>
        </p>
      </div>
    </main>
  );
}