import { describe, it, expect, vi, beforeEach } from "vitest";
import bcrypt from "bcryptjs";

// Mock do Prisma antes de importar o service
vi.mock("../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock do bcrypt para controlar o comportamento nos testes
vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn(),
  },
}));

import { registerUser, loginUser } from "../auth.service";
import { prisma } from "../../../lib/prisma";

const mockUser = {
  id: "user-123",
  name: "Pedro",
  email: "pedro@teste.com",
  passwordHash: "hashed_password",
  createdAt: new Date(),
};

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should create a new user and return tokens", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.user.create).mockResolvedValue(mockUser);

      const result = await registerUser({
        name: "Pedro",
        email: "pedro@teste.com",
        password: "Senha123",
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "pedro@teste.com" },
      });
      expect(prisma.user.create).toHaveBeenCalledOnce();
      expect(result.user.email).toBe("pedro@teste.com");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw if email is already registered", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);

      await expect(
        registerUser({
          name: "Pedro",
          email: "pedro@teste.com",
          password: "Senha123",
        })
      ).rejects.toThrow("E-mail já cadastrado");
    });
  });

  describe("loginUser", () => {
    it("should return user and tokens on valid credentials", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

      const result = await loginUser({
        email: "pedro@teste.com",
        password: "Senha123",
      });

      expect(result.user.id).toBe("user-123");
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it("should throw on wrong password", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        loginUser({ email: "pedro@teste.com", password: "ErradA123" })
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw on non-existent email", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      await expect(
        loginUser({ email: "naoexiste@teste.com", password: "Senha123" })
      ).rejects.toThrow("Invalid credentials");
    });
  });
});