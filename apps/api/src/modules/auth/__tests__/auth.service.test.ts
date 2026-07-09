import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockDeep, mockReset, type DeepMockProxy } from "vitest-mock-extended";
import jwt from "jsonwebtoken";
import type { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

// Mocka o client do Prisma inteiro — nenhum teste aqui toca um banco real
vi.mock("../../../lib/prisma", () => ({
  prisma: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

// Importado depois do mock, para garantir que o serviço recebe a versão mockada
import { registerUser, loginUser, refreshTokens } from "../auth.service";

describe("auth.service", () => {
  beforeEach(() => {
    mockReset(prismaMock);
  });

  describe("registerUser", () => {
    it("cria o usuário e retorna tokens quando o e-mail não existe ainda", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: "user-1",
        name: "Ana Silva",
        email: "ana@example.com",
        createdAt: new Date(),
      } as any);

      const result = await registerUser({
        name: "Ana Silva",
        email: "ana@example.com",
        password: "Senha123",
      });

      expect(result.user.email).toBe("ana@example.com");
      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");

      // A senha nunca deve ser salva em texto plano
      const createCall = prismaMock.user.create.mock.calls[0][0];
      expect(createCall.data.passwordHash).not.toBe("Senha123");
    });

    it("lança erro quando o e-mail já está cadastrado", async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: "user-1" } as any);

      await expect(
        registerUser({ name: "Ana", email: "ana@example.com", password: "Senha123" })
      ).rejects.toThrow("E-mail já cadastrado");

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("loginUser", () => {
    it("retorna tokens para credenciais válidas", async () => {
      // Hash real de "Senha123" gerado com bcryptjs (12 rounds)
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash("Senha123", 12);

      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "Ana",
        email: "ana@example.com",
        passwordHash,
      } as any);

      const result = await loginUser({ email: "ana@example.com", password: "Senha123" });

      expect(result.user).toEqual({ id: "user-1", name: "Ana", email: "ana@example.com" });
      expect(typeof result.accessToken).toBe("string");
    });

    it("lança 'Credenciais inválidas' quando o usuário não existe", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        loginUser({ email: "fantasma@example.com", password: "Senha123" })
      ).rejects.toThrow("Credenciais inválidas");
    });

    it("lança 'Credenciais inválidas' quando a senha está errada (sem revelar qual campo)", async () => {
      const bcrypt = await import("bcryptjs");
      const passwordHash = await bcrypt.hash("SenhaCorreta1", 12);

      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-1",
        name: "Ana",
        email: "ana@example.com",
        passwordHash,
      } as any);

      await expect(
        loginUser({ email: "ana@example.com", password: "SenhaErrada1" })
      ).rejects.toThrow("Credenciais inválidas");
    });
  });

  describe("refreshTokens", () => {
    it("gera novos tokens para um refresh token válido", async () => {
      const refreshToken = jwt.sign({ sub: "user-1" }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      });
      prismaMock.user.findUnique.mockResolvedValue({ id: "user-1" } as any);

      const result = await refreshTokens(refreshToken);

      expect(typeof result.accessToken).toBe("string");
      expect(typeof result.refreshToken).toBe("string");
    });

    it("lança erro para um refresh token inválido", async () => {
      await expect(refreshTokens("token-invalido")).rejects.toThrow(
        "Refresh token inválido ou expirado"
      );
    });

    it("lança erro quando o usuário do token não existe mais", async () => {
      const refreshToken = jwt.sign({ sub: "user-inexistente" }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      });
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(refreshTokens(refreshToken)).rejects.toThrow("Usuário não encontrado");
    });
  });
});
