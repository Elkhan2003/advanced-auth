import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getTodos = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;
		
		if (!userId) {
			return res.status(401).json({
				success: false,
				message: "Пользователь не найден в токене",
			});
		}

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

		const data = await prisma.todo.findMany({
			where: {
				userId: localUser.id,
			},
		});
		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in getTodos: ${e}`,
		});
	}
};

const getTodoById = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const data = await prisma.todo.findFirst({
			where: {
				id: +id,
			},
		});
		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in getTodoById: ${e}`,
		});
	}
};

const createTodo = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;
		const { title, description } = req.body;
		
		if (!userId) {
			return res.status(401).json({
				success: false,
				message: "Пользователь не найден в токене",
			});
		}

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

		const data = await prisma.todo.create({
			data: {
				userId: localUser.id,
				title: title,
				description: description,
			},
		});
		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in createTodo: ${e}`,
		});
	}
};

const updateTodo = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const { title, description } = req.body;

		const data = await prisma.todo.update({
			where: {
				id: +id,
			},
			data: {
				title: title,
				description: description,
			},
		});

		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in updateTodo: ${e}`,
		});
	}
};

const deleteTodo = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const data = await prisma.todo.delete({
			where: {
				id: +id,
			},
		});
		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in deleteTodo: ${e}`,
		});
	}
};

export default { getTodos, getTodoById, createTodo, updateTodo, deleteTodo };
