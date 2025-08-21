"use client";
import { FC, useState } from "react";
import scss from "./TodoAdd.module.scss";
import { useCreateTodoMutation } from "@/api/todo";
import { useAuthStore } from "@/stores/useAuthStore";

export const TodoAdd: FC = () => {
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const { user } = useAuthStore();

	const { mutateAsync: createTodoMutation } = useCreateTodoMutation();

	const handleCreateTodo = async () => {
		try {
			await createTodoMutation({
				title,
				description,
			});
			setTitle("");
			setDescription("");
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<section className={scss.TodoAdd}>
			<div className="container">
				<div className={scss.content}>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<button onClick={handleCreateTodo}>add</button>
				</div>
			</div>
		</section>
	);
};
