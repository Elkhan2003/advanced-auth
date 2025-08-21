import { Request, Response, NextFunction } from "express";
import { supabase } from "../plugins/supabase";

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

		const {
			data: { user },
			error,
		} = await supabase.auth.getUser(token);

		if (error || !user) {
			return res.status(401).json({
				success: false,
				message: "Недействительный токен",
			});
		}

		req.user = user;
		next();
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Ошибка авторизации",
		});
	}
};
