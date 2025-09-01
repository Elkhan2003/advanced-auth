import { config } from "dotenv";
config();
import express from "express";
import routes from "./routes";
import { User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			user?: User;
		}
	}
}

export const buildServer = () => {
	const server = express();

	// Middleware
	server.use(express.json());

	server.get("/", (req, res) => {
		res.status(200).send({
			message: "Hello World!",
		});
	});

	server.use("/api/v1", routes);

	return server;
};
