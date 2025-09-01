import { Request, Response, NextFunction } from "express";
import { supabase } from "../plugins/supabase";
import prisma from "../plugins/prisma";

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({
				success: false,
				message: "Отсутствует токен авторизации",
			});
		}

		const token = authHeader.substring(7);

		const { data: supabaseUser, error } = await supabase.auth.getUser(token);

		if (error || !supabaseUser.user) {
			return res.status(401).json({
				success: false,
				message: "Недействительный токен",
			});
		}

		// Найти пользователя в базе данных по supabaseId
		const dbUser = await prisma.user.findUnique({
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
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Ошибка авторизации",
		});
	}
};
