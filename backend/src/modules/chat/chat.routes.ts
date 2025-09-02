import { Router } from "express";
import chatControllers from "./chat.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/get-all", authMiddleware, chatControllers.getMessages);
router.post("/send", authMiddleware, chatControllers.sendMessage);
router.get("/get-users", authMiddleware, chatControllers.getUsersMessage);
router.get(
	"/get-message/:receiverId",
	authMiddleware,
	chatControllers.getPrivateMessage
);
router.post("/send-to-user", authMiddleware, chatControllers.sendMessageUser);

export default router;
