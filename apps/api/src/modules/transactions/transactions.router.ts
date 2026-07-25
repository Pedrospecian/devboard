import { Router } from "express";
import { authenticate } from "../../middlewares/auth";
import { list, summary, chart, create, remove, categories } from "./transactions.controller";

export const transactionsRouter = Router();

transactionsRouter.use(authenticate);
transactionsRouter.get("/", list);
transactionsRouter.get("/summary", summary);
transactionsRouter.get("/chart", chart);
transactionsRouter.post("/", create);
transactionsRouter.delete("/:id", remove);

transactionsRouter.get("/categories", categories);