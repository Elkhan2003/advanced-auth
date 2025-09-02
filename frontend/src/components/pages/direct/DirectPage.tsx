"use client";
import { FC, useState } from "react";
import scss from "./DirectPage.module.scss";
import {
	useGetPrivateMessageQuery,
	useGetUsersMessageQuery,
	useSendMessageToUserMutation,
} from "@/api/message";
import { useRouter, useSearchParams } from "next/navigation";

export const DirectPage: FC = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const receiverId = searchParams.get("receiver");
	const [message, setMessage] = useState("");
	const { data: usersMessageData } = useGetUsersMessageQuery();
	const { data: privateMessageData } = useGetPrivateMessageQuery(
		Number(receiverId)
	);
	const { mutateAsync: sendMessageToUserMutation } =
		useSendMessageToUserMutation();

	const handleSendMessageToUser = async () => {
		await sendMessageToUserMutation({
			receiverId: Number(receiverId),
			message: message,
		});
	};

	return (
		<section className={scss.DirectPage}>
			<div className="container">
				<div className={scss.content}>
					<h3>DirectPage</h3>
					<div className={scss.chats}>
						{/* left */}
						<div className={scss.user_list}>
							{usersMessageData?.data.map((item) => (
								<div
									key={item.id}
									onClick={() => router.push(`/direct/?receiver=${item.id}`)}>
									<strong>{item.fullName}</strong>
								</div>
							))}
						</div>

						{/* right */}
						<div className={scss.chat}>
							<div>
								{privateMessageData?.data.map((item) => (
									<div key={item.id}>
										<p>{item.message}</p>
									</div>
								))}
							</div>
							<textarea onChange={(e) => setMessage(e.target.value)}>
								Enter message...
							</textarea>
							<button onClick={handleSendMessageToUser}>send</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
