"use client";
import { FC, useEffect, useState, KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { useWindowSize } from "react-use";
import scss from "./MessageList.module.scss";
import { useGetMessagesQuery, useSendMessageMutation } from "@/api/message";
import { supabase } from "@/utils/supabase/client";
import { useGetMeQuery } from "@/api/user";
import { useAuthStore } from "@/stores/useAuthStore";

export const MessageList: FC = () => {
	const [message, setMessage] = useState<string>("");
	const [isClient, setIsClient] = useState(false);
	const { height } = useWindowSize();
	const { isAuthenticated } = useAuthStore();
	const { data: meData } = useGetMeQuery({
		enabled: isAuthenticated(),
	});
	const { data: messagesData, refetch: refetchMessages } =
		useGetMessagesQuery();
	const { mutateAsync: createMessageMutation } = useSendMessageMutation();

	// Set isClient to true after component mounts
	useEffect(() => {
		setIsClient(true);
	}, []);

	// Вычисляем высоту области сообщений на основе размера экрана
	const getMessagesHeight = () => {
		// During SSR or before hydration, return a default style that matches initial render
		if (!isClient || !height) {
			return "60vh"; // Use consistent fallback for both server and initial client render
		}
		// Учитываем высоту заголовка (~100px), input области (~120px) и отступы (~80px)
		const reservedHeight = 350;
		const availableHeight = height - reservedHeight;
		return `${availableHeight}px`;
	};

	const handleSendMessage = async () => {
		if (!message.trim()) return;
		try {
			await createMessageMutation({
				message: message.trim(),
			});
			setMessage("");
		} catch (e) {
			console.error(e);
		}
	};

	const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	useEffect(() => {
		const subscription = supabase
			.channel("channel-messages")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "Messages",
				},
				() => {
					refetchMessages();
				}
			)
			.subscribe();

		return () => {
			subscription.unsubscribe();
		};
	}, [supabase]);

	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString("ru-RU", {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const messagesHeight = getMessagesHeight();

	return (
		<div className={scss.MessageList}>
			<div className="container">
				<div className={scss.content}>
					<h1 className={scss.header}>
						Сообщения ({messagesData?.data.length || 0})
					</h1>

					<div
						className={scss.messages}
						style={{
							maxHeight: messagesHeight,
							height: messagesHeight,
						}}>
						{messagesData?.data
							.slice()
							.reverse()
							.map((item) => {
								const isOwn = meData?.data.id === item.userId;
								const userName =
									item.user?.fullName || item.user?.email || "Unknown";

								return (
									<div
										key={item.id}
										className={`${scss.message} ${
											isOwn ? scss.own : scss.other
										}`}>
										<div className={scss.messageBubble}>
											<div className={scss.text}>{item.message}</div>
											<div className={scss.info}>
												{!isOwn && (
													<span className={scss.author}>{userName}</span>
												)}
												<span className={scss.time}>
													{formatTime(
														item.createdAt || new Date().toISOString()
													)}
												</span>
											</div>
										</div>
									</div>
								);
							})}
					</div>

					<div className={scss.messageInput}>
						<div className={scss.inputContainer}>
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Введите сообщение... (Enter для отправки, Shift+Enter для новой строки)"
								className={scss.textarea}
								rows={1}
								maxLength={1000}
							/>
							<button
								onClick={handleSendMessage}
								disabled={!message.trim()}
								className={scss.sendButton}
								title="Отправить сообщение">
								<Send size={20} />
							</button>
						</div>
						<div className={scss.messageInfo}>
							<span className={scss.charCount}>{message.length}/1000</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
