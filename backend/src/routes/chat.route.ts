import { Router } from "express";
import { passportAuthenticateJwt } from "../config/passport.config";
import {
    createChatController,
    getSingleChatController,
    getUserChatsController,
} from "../controllers/chat.controllers";
import { sendMessageController } from "../controllers/message.controllers";

const chatRoutes = Router()
  .use(passportAuthenticateJwt)
  .post("/create", createChatController)
  .post("/message/send", sendMessageController)
  .get("/all", getUserChatsController)
  .get("/:id", getSingleChatController);

export default chatRoutes;