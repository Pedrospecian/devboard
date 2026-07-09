import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../auth.schema";

describe("registerSchema", () => {
  it("aceita um payload válido", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Senha123",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita nome com menos de 2 caracteres", () => {
    const result = registerSchema.safeParse({
      name: "A",
      email: "ana@example.com",
      password: "Senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "não-é-email",
      password: "Senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha sem letra maiúscula", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha sem número", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "SenhaSemNumero",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita senha com menos de 8 caracteres", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Ab1",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("aceita e-mail e senha válidos", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "qualquer-coisa",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita senha vazia", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita e-mail inválido", () => {
    const result = loginSchema.safeParse({
      email: "não-é-email",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });
});
