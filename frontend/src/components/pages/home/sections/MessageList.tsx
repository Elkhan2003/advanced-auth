"use client";
import { FC, useEffect, useState } from "react";
import scss from "./MessageList.module.scss";
import { useGetMessagesQuery } from "@/api/message";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/utils/supabase/client";

export const MessageList: FC = () => {
	const { isAuthenticated } = useAuthStore();

	const { data: messagesData, refetch: refetchMessages } = useGetMessagesQuery({
		enabled: isAuthenticated(),
	});

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

	return (
		<section className={scss.MessageList}>
			<div className="container">
				<div className={scss.content}>
					<h1>Всего сообщений: {messagesData?.data.length}</h1>
					{messagesData?.data
						.slice()
						.reverse()
						.map((item) => (
							<div className={scss.card} key={item.id}>
								<p>{item.message}</p>
							</div>
						))}
				</div>
			</div>
		</section>
	);
};
