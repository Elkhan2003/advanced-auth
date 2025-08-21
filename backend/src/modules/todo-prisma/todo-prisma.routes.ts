import { Router } from "express";
import todoPrismaControllers from "./todo-prisma.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/get-all", authMiddleware, todoPrismaControllers.getTodos);
router.get("/get/:id", authMiddleware, todoPrismaControllers.getTodoById);
router.post("/create", authMiddleware, todoPrismaControllers.createTodo);
router.patch("/update/:id", authMiddleware, todoPrismaControllers.updateTodo);
router.delete("/delete", authMiddleware, todoPrismaControllers.deleteTodo);

export default router;
