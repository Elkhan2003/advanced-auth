"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("../../plugins/prisma"));
const supabase_1 = require("../../plugins/supabase");
const signUpUser = async (req, res) => {
    try {
        const { email, password, fullName, age } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email и пароль обязательны",
            });
        }
        const { data: authData, error: authError } = await supabase_1.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    age: age,
                },
            },
        });
        if (authError) {
            return res.status(400).json({
                success: false,
                message: authError.message,
            });
        }
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email: email },
        });
        let data;
        if (existingUser) {
            data = await prisma_1.default.user.update({
                where: { email: email },
                data: {
                    fullName: fullName,
                    age: age,
                    supabaseId: authData.user?.id,
                },
            });
        }
        else {
            data = await prisma_1.default.user.create({
                data: {
                    email: email,
                    fullName: fullName,
                    age: age,
                    supabaseId: authData.user?.id,
                },
            });
        }
        res.status(200).json({
            success: true,
            data: {
                user: authData.user,
                session: authData.session,
                localUser: data,
            },
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in signUpUser: ${e}`,
        });
    }
};
const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email и пароль обязательны",
            });
        }
        const { data: authData, error: authError } = await supabase_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (authError) {
            return res.status(401).json({
                success: false,
                message: authError.message,
            });
        }
        const localUser = await prisma_1.default.user.findFirst({
            where: {
                email: email,
            },
        });
        res.status(200).json({
            success: true,
            data: {
                user: authData.user,
                session: authData.session,
                localUser: localUser,
            },
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in signInUser: ${e}`,
        });
    }
};
const getMe = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Пользователь не найден в токене",
            });
        }
        const data = await prisma_1.default.user.findFirst({
            where: {
                id: userId,
            },
        });
        if (!data) {
            return res.status(404).json({
                success: false,
                message: "Пользователь не найден в базе данных",
            });
        }
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in getMe: ${e}`,
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { fullName, age } = req.body;
        const data = await prisma_1.default.user.update({
            where: {
                id: +id,
            },
            data: {
                fullName: fullName,
                age: age,
            },
        });
        res.status(200).json({
            success: true,
            data,
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in updateUser: ${e}`,
        });
    }
};
const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) {
            return res.status(400).json({
                success: false,
                message: "Refresh token обязателен",
            });
        }
        const { data: authData, error: authError } = await supabase_1.supabase.auth.refreshSession({
            refresh_token,
        });
        if (authError) {
            return res.status(401).json({
                success: false,
                message: authError.message,
            });
        }
        res.status(200).json({
            success: true,
            data: {
                session: authData.session,
                user: authData.user,
            },
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in refreshToken: ${e}`,
        });
    }
};
const signOutUser = async (req, res) => {
    try {
        const { error } = await supabase_1.supabase.auth.signOut();
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        res.status(200).json({
            success: true,
            message: "Успешный выход из системы",
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: `error in signOutUser: ${e}`,
        });
    }
};
exports.default = {
    signUpUser,
    signInUser,
    getMe,
    updateUser,
    refreshToken,
    signOutUser,
};
