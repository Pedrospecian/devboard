import type { Request, Response, NextFunction } from "express";
import { createTransactionSchema } from "./transactions.schema";
import * as service from "./transactions.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await service.getTransactions(req.user!.id);
    res.json(data);
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
    await service.deleteTransaction(req.user!.id, req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
}