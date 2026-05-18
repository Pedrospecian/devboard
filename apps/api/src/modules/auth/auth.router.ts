import { Router } from "express";
import { register, login, refresh, me } from "./auth.controller";
import { authenticate } from "../../middlewares/auth";

export const authRouter = Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.get("/me", authenticate, me);