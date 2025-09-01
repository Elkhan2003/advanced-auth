"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const supabase_1 = require("../plugins/supabase");
const prisma_1 = __importDefault(require("../plugins/prisma"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Отсутствует токен авторизации",
            });
        }
        const token = authHeader.substring(7);
        const { data: supabaseUser, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !supabaseUser.user) {
            return res.status(401).json({
                success: false,
                message: "Недействительный токен",
            });
        }
        // Найти пользователя в базе данных по supabaseId
        const dbUser = await prisma_1.default.user.findUnique({
            where: {
                supabaseId: supabaseUser.user.id,
            },
        });
        if (!dbUser) {
            return res.status(401).json({
                success: false,
                message: "Пользователь не найден",
            });
        }
        // Добавляем все данные из таблицы user и токены
        req.user = dbUser;
        next();
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Ошибка авторизации",
        });
    }
};
exports.authMiddleware = authMiddleware;
