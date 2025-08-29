import { TodoAdd } from "./sections/TodoAdd";
import { TodoList } from "./sections/TodoList";

export const HomePage = () => {
	return (
		<>
			{/* <PopularMovie /> */}
			<TodoAdd />
			<TodoList />
		</>
	);
};
