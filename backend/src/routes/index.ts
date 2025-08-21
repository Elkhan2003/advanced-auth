import { Router } from "express";
import cors from "cors";
import todoRoutes from "../modules/todo/todo.routes";
import todoPrismaRoutes from "../modules/todo-prisma/todo-prisma.routes";
import userRoutes from "../modules/user/user.routes";

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
router.use("/todo", cors(configCors), todoRoutes);
router.use("/todo-prisma", cors(configCors), todoPrismaRoutes);

export default router;
