"use client";
import { FC } from "react";
import scss from "./MessageList.module.scss";
import { useGetMessagesQuery } from "@/api/message";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/utils/supabase/client";

export const MessageList: FC = () => {
	const { isAuthenticated } = useAuthStore();

	const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery({
		enabled: isAuthenticated(),
	});

	return (
		<section className={scss.MessageList}>
			<div className="container">
				<div className={scss.content}>
					<h1>Всего сообщений: {messagesData?.data.length}</h1>
					{messagesData?.data.map((item) => (
						<div className={scss.card} key={item.id}>
							<p>{item.message}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
