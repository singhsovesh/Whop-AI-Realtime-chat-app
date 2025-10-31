import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
  authStatusController,
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller";

const authRoutes = Router()
  .post("/register", registerController)
  .post("/login", loginController)
  .post("/logout", logoutController)
  .get("/status", passportAuthenticateJwt, authStatusController);

export default authRoutes;