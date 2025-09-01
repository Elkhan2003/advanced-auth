"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controllers_1 = __importDefault(require("./chat.controllers"));
const auth_1 = require("../../middleware/auth");
const router = (0, express_1.Router)();
router.get("/get-all", auth_1.authMiddleware, chat_controllers_1.default.getMessages);
router.post("/send", auth_1.authMiddleware, chat_controllers_1.default.sendMessage);
exports.default = router;
