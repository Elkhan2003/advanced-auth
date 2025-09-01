import { MessageAdd } from "./sections/MessageAdd";
import { MessageList } from "./sections/MessageList";

export const HomePage = () => {
	return (
		<>
			<MessageAdd />
			<MessageList />
		</>
	);
};
