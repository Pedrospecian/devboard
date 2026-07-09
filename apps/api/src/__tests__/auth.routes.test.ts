import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../lib/prisma";

vi.mock("../lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Importado depois do mock, para o app usar o Prisma mockado em toda a cadeia de módulos
import { app } from "../app";

describe("POST /auth/register", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("cria o usuário e retorna 201 com os tokens", async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: "user-1",
      name: "Ana Silva",
      email: "ana@example.com",
      createdAt: new Date(),
    } as any);

    const res = await request(app).post("/auth/register").send({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Senha123",
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe("ana@example.com");
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it("retorna 422 com payload inválido (sem passar pelo service)", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "A",
      email: "não-é-email",
      password: "123",
    });

    expect(res.status).toBe(422);
    expect(res.body.message).toBe("Dados inválidos");
    expect(prismaMock.user.findUnique).not.toHaveBeenCalled();
  });

  it("retorna 400 quando o e-mail já está cadastrado", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "user-1" } as any);

    const res = await request(app).post("/auth/register").send({
      name: "Ana Silva",
      email: "ana@example.com",
      password: "Senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("E-mail já cadastrado");
  });
});

describe("GET /auth/me", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  it("retorna 401 sem token de autenticação", async () => {
    const res = await request(app).get("/auth/me");
    expect(res.status).toBe(401);
  });
});

describe("GET /health", () => {
  it("responde 200 com status ok", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
