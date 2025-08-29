"use client";
import { FC } from "react";
import scss from "./TodoList.module.scss";
import { useGetTodosQuery } from "@/api/todo";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export const TodoList: FC = () => {
	const router = useRouter();
	const { isAuthenticated } = useAuthStore();

	const { data: todosData } = useGetTodosQuery({
		enabled: isAuthenticated(),
	});

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
