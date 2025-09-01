import { Router } from "express";
import cors from "cors";
import userRoutes from "../modules/user/user.routes";
import chatRoutes from "../modules/chat/chat.routes";

const configCors = {
	origin: [
		"http://localhost:3000",
		"https://motion.kg",
		"https://elcho.dev",
		"https://isa.dev",
	],
};

const router = Router();

router.use("/user", cors(configCors), userRoutes);
router.use("/message", cors(configCors), chatRoutes);

export default router;
