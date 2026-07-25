import type { Request, Response, NextFunction } from "express";
import { createTransactionSchema } from "./transactions.schema";
import * as service from "./transactions.service";
import { prisma } from "../../lib/prisma";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const month = typeof req.query.month === "string" ? req.query.month : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const data = await service.getTransactions(req.user!.id, { month, category });
    res.json(data);
  } catch (err) { next(err); }
}

export async function categories(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    res.json(result.map((r) => r.category));
  } catch (err) { next(err); }
}


export async function summary(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getSummary(req.user!.id);
    res.json(data);
  } catch (err) { next(err); }
}

export async function chart(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getMonthlyChart(req.user!.id);
    res.json(data);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const input = createTransactionSchema.parse(req.body);
    const data = await service.createTransaction(req.user!.id, input);
    res.status(201).json(data);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await service.deleteTransaction(req.user!.id, id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}