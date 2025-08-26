import { Router } from "express";
import favoriteControllers from "./favorite.controllers";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

router.get("/get-all", authMiddleware, favoriteControllers.getFavorites);
router.post("/add", authMiddleware, favoriteControllers.addFavorite);

export default router;
