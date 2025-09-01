"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../plugins/prisma"));
const getMessages = async (req, res) => {
    try {
        const data = await prisma_1.default.messages.findMany({
            where: {
                userId: req.user?.id,
            },
            include: {
                user: true,
            },
        });
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in getMessages: ${e}`,
        });
    }
};
const sendMessage = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { message } = req.body;
        const data = await prisma_1.default.messages.create({
            data: {
                userId: userId,
                message: message,
            },
        });
        res.status(200).send({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: `error in sendMessage: ${e}`,
        });
    }
};
exports.default = { getMessages, sendMessage };
