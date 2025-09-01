import { Router } from "express";
import chatControllers from "./chat.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/get-all", authMiddleware, chatControllers.getMessages);
router.post("/send", authMiddleware, chatControllers.sendMessage);

export default router;
