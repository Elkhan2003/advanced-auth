import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getMessages = async (req: Request, res: Response) => {
	try {
		const data = await prisma.messages.findMany({
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
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in getMessages: ${e}`,
		});
	}
};

const sendMessage = async (req: Request, res: Response) => {
	try {
		const userId = req.user?.id;
		const { message } = req.body;

		const data = await prisma.messages.create({
			data: {
				userId: userId!,
				message: message,
			},
		});
		res.status(200).send({
			success: true,
			data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in sendMessage: ${e}`,
		});
	}
};

export default { getMessages, sendMessage };
