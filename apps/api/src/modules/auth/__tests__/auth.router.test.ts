import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { authRouter } from "../auth.router";

vi.mock("../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";

const mockUser = {
  id: "user-123",
  name: "Pedro",
  email: "pedro@teste.com",
  passwordHash: "hashed_password",
  createdAt: new Date(),
};

// App mínimo só para testar o router
const app = express();
app.use(express.json());
app.use("/auth", authRouter);
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  res.status(400).json({ message: err.message });
});

describe("POST /auth/register", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 201 and tokens on success", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
    vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

    const res = await request(app).post("/auth/register").send({
      name: "Pedro",
      email: "pedro@teste.com",
      password: "Senha123",
    });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user.email).toBe("pedro@teste.com");
  });

  it("should return 422 on invalid body", async () => {
    const res = await request(app).post("/auth/register").send({
      name: "P",
      email: "not-an-email",
      password: "123",
    });

    expect(res.status).toBe(422);
  });

  it("should return 400 if email already exists", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

    const res = await request(app).post("/auth/register").send({
      name: "Pedro",
      email: "pedro@teste.com",
      password: "Senha123",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("E-mail já cadastrado");
  });
});

describe("POST /auth/login", () => {
  beforeEach(() => vi.clearAllMocks());

  it("should return 200 and tokens on valid credentials", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const res = await request(app).post("/auth/login").send({
      email: "pedro@teste.com",
      password: "Senha123",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it("should return 400 on wrong password", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const res = await request(app).post("/auth/login").send({
      email: "pedro@teste.com",
      password: "Errada123",
    });

    expect(res.status).toBe(400);
  });
});