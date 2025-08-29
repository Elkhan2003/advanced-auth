"use client";
import { FC, useEffect } from "react";
import scss from "./TodoList.module.scss";
import { useGetTodosQuery } from "@/api/todo";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

export const TodoList: FC = () => {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();

	const { data: todosData, refetch: refetchTodos } = useGetTodosQuery({
		enabled: isAuthenticated(),
	});

	useEffect(() => {
		if (!isAuthenticated()) return;

		// Подписка на real-time изменения в таблице todos
		const subscription = supabase
			.channel("todos-changes")
			.on(
				"postgres_changes",
				{
					event: "*", // Слушаем все события (INSERT, UPDATE, DELETE)
					schema: "public",
					table: "Todo", // Замените на название вашей таблицы
				},
				(payload) => {
					console.log("Real-time update:", payload);
					refetchTodos();
				}
			)
			.subscribe();

		// Очистка подписки при размонтировании компонента
		return () => {
			subscription.unsubscribe();
		};
	}, [isAuthenticated, refetchTodos, supabase]);

	return (
		<section className={scss.TodoList}>
			<div className="container">
				<div className={scss.content}>
					<h1>Всего Todo: {todosData?.data.length}</h1>
					{todosData?.data.map((item) => (
						<div className={scss.card} key={item.id}>
							<h2>{item.title}</h2>
							<p>{item.description}</p>
							<button onClick={() => router.push(`/card/${item.id}`)}>
								view card
							</button>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
