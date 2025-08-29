import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getFavorites = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	try {
		const localUser = await prisma.user.findFirst({
			where: {
				supabaseId: userId,
			},
		});

		if (!localUser) {
			return res.status(404).json({
				success: false,
				message: "Пользователь не найден в базе данных",
			});
		}

		const data = await prisma.favorite.findMany({
			where: {
				userId: localUser.id,
			},
		});

		res.status(200).json({
			success: true,
			data: data,
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `error in getFavorites: ${e}`,
		});
	}
};

const addFavorite = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { itemId } = req.body;
	try {
		const localUser = await prisma.user.findFirst({
			where: {
				supabaseId: userId,
			},
		});

		if (!localUser) {
			return res.status(404).json({
				success: false,
				message: "Пользователь не найден в базе данных",
			});
		}

		const existingFavorite = await prisma.favorite.findFirst({
			where: {
				userId: localUser.id,
				itemId: Number(itemId),
			},
		});

		if (existingFavorite) {
			return res.status(400).json({
				success: false,
				message: "Item is already in favorites",
			});
		}

		const newFavorite = await prisma.favorite.create({
			data: {
				userId: localUser.id,
				itemId: Number(itemId),
			},
		});

		res.status(201).json({
			success: true,
			data: newFavorite,
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `error in addFavorite: ${e}`,
		});
	}
};

const deleteFavorite = async (req: Request, res: Response) => {
	const userId = req.user?.id;
	const { id } = req.params;
	try {
		const localUser = await prisma.user.findFirst({
			where: {
				supabaseId: userId,
			},
		});
		if (!localUser) {
			return res.status(404).json({
				success: false,
				message: "Пользователь не найден в базе данных",
			});
		}
		const existingFavorite = await prisma.favorite.findFirst({
			where: {
				userId: localUser.id,
				itemId: Number(id),
			},
		});
		if (!existingFavorite) {
			return res.status(400).json({
				success: false,
				message: "Item is not in favorites",
			});
		}
		await prisma.favorite.delete({
			where: {
				id: existingFavorite.id,
			},
		});

		res.status(200).json({
			success: true,
			message: "Item removed from favorites",
		});
	} catch (e) {
		res.status(500).json({
			success: false,
			message: `error in deleteFavorite: ${e}`,
		});
	}
};

export default {
	getFavorites,
	addFavorite,
	deleteFavorite,
};
