import { describe, it, expect, vi, beforeEach } from "vitest";
import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
import { authenticate } from "../auth";

function mockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res as Response;
}

describe("authenticate middleware", () => {
  let next: NextFunction;

  beforeEach(() => {
    next = vi.fn();
  });

  it("retorna 401 quando não há header Authorization", () => {
    const req = { headers: {} } as Request;
    const res = mockRes();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token não fornecido" });
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o header não começa com 'Bearer '", () => {
    const req = { headers: { authorization: "Token abc123" } } as Request;
    const res = mockRes();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("retorna 401 quando o token é inválido", () => {
    const req = { headers: { authorization: "Bearer token-invalido" } } as Request;
    const res = mockRes();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token inválido ou expirado" });
    expect(next).not.toHaveBeenCalled();
  });

  it("popula req.user e chama next() quando o token é válido", () => {
    const token = jwt.sign({ sub: "user-1" }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;
    const res = mockRes();

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: "user-1" });
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
