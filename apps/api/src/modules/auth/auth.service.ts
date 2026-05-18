import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";
import { env } from "../../config/env";
import type { RegisterInput, LoginInput } from "./auth.schema";

// Gera access token (expira em 15 min)
function generateAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });
}

// Gera refresh token (expira em 7 dias)
function generateRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });

  if (existing) {
    throw new Error("E-mail já cadastrado");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
    },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  // Mesmo erro para email e senha errados — evita user enumeration
  const invalidCredentialsError = new Error("Credenciais inválidas");

  if (!user) throw invalidCredentialsError;

  const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatch) throw invalidCredentialsError;

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return {
    user: { id: user.id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(token: string) {
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  } catch {
    throw new Error("Refresh token inválido ou expirado");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) throw new Error("Usuário não encontrado");

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { accessToken, refreshToken };
}