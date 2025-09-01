"use client";
import { FC, useState } from "react";
import scss from "./MessageAdd.module.scss";
import { useSendMessageMutation } from "@/api/message";
import { useAuthStore } from "@/stores/useAuthStore";

export const MessageAdd: FC = () => {
	const [message, setMessage] = useState<string>("");
	const { user } = useAuthStore();

	const { mutateAsync: createMessageMutation } = useSendMessageMutation();

	const handleCreateMessage = async () => {
		try {
			await createMessageMutation({
				message,
			});
			setMessage("");
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className={scss.MessageAdd}>
			<div className="container">
				<div className={scss.content}>
					<input
						type="text"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Введите сообщение..."
					/>
					<button onClick={handleCreateMessage}>Отправить</button>
				</div>
			</div>
		</section>
	);
};
