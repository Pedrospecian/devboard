import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

// Extende o tipo Request do Express para incluir req.user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: payload.sub as string };
    next();
  } catch {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
}