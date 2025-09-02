import { Request, Response } from "express";
import prisma from "../../plugins/prisma";

const getMessages = async (req: Request, res: Response) => {
	try {
		const data = await prisma.messages.findMany({
			// where: {
			// 	userId: req.user?.id,
			// },
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

const getUsersMessage = async (req: Request, res: Response) => {
	try {
		const data = await prisma.user.findMany();
		res.status(200).send({
			success: true,
			data: data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in getUsersMessage: ${e}`,
		});
	}
};

const getPrivateMessage = async (req: Request, res: Response) => {
	const senderId = req.user?.id;
	const receiverId = req.params.receiverId;
	try {
		const data = await prisma.privateMessages.findMany({
			where: {
				senderId: senderId,
				receiverId: +receiverId,
			},
		});
		res.status(200).send({
			success: true,
			data: data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in getPrivateMessage: ${e}`,
		});
	}
};

const sendMessageUser = async (req: Request, res: Response) => {
	const senderId = req.user?.id;
	const { receiverId, message } = req.body;
	try {
		const data = await prisma.privateMessages.create({
			data: {
				senderId: Number(senderId),
				receiverId: Number(receiverId),
				message: message,
			},
		});
		res.status(200).send({
			success: true,
			data: data,
		});
	} catch (e) {
		res.status(500).send({
			success: false,
			message: `error in sendMessageUser: ${e}`,
		});
	}
};

export default {
	getMessages,
	sendMessage,
	getUsersMessage,
	getPrivateMessage,
	sendMessageUser,
};
