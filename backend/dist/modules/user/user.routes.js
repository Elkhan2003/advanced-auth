"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = __importDefault(require("./user.controllers"));
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/me", auth_1.authMiddleware, user_controllers_1.default.getMe);
router.post("/sign-up", user_controllers_1.default.signUpUser);
router.post("/sign-in", user_controllers_1.default.signInUser);
router.post("/refresh-token", user_controllers_1.default.refreshToken);
router.post("/sign-out", auth_1.authMiddleware, user_controllers_1.default.signOutUser);
router.patch("/update/:id", auth_1.authMiddleware, user_controllers_1.default.updateUser);
exports.default = router;
