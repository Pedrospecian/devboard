import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema } from "../auth.schema";

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Senha123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a name with less than 2 characters", () => {
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

  it("rejects a password without uppercase letter", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "senha123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without lowercase letter", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "SENHA123",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password without number", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "SenhaSemNumero",
    });

    expect(result.success).toBe(false);
  });

  it("rejects a password with less than 8 characters", () => {
    const result = registerSchema.safeParse({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Ab1",
    });

    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("accepts valid e-mail and password", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "Qualquer-coisa123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({
      email: "ana@example.com",
      password: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    });

    expect(result.success).toBe(false);
  });
});
