import express from "express";
import cors from "cors";
import { ZodError } from "zod";
import { authRouter } from "./modules/auth/auth.router";
import { transactionsRouter } from "./modules/transactions/transactions.router";

export const app = express();

// Middlewares globais
app.use(cors({
  origin: [
    'http://localhost:3000', // Permite seu Next.js local
    'https://devboard-web-pink.vercel.app' // SUBSTiTUA pela URL real do seu frontend na Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Rotas
app.use("/auth", authRouter);

app.use("/transactions", transactionsRouter);

// Error handler global
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (err instanceof ZodError) {
    res.status(422).json({
      message: "Dados inválidos",
      errors: err.flatten().fieldErrors,
    });
    return;
  }

  if (err instanceof Error) {
    const status = err.message.includes("inválid") || err.message.includes("cadastrad") ? 400 : 500;
    res.status(status).json({ message: err.message });
    return;
  }

  res.status(500).json({ message: "Erro interno do servidor" });
});
