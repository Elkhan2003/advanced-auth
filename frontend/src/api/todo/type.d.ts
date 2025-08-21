namespace TODO {
	// get-todo
	type GetTodosRes = {
		success: boolean;
		data: Array<{
			id: number;
			userId: number;
			title: string;
			description: string;
		}>;
	};
	type GetTodosReq = {
		enabled?: boolean;
	};

	// create-todo
	type CreateTodoRes = {
		success: boolean;
		data: {
			id: number;
			userId: number;
			title: string;
			description: string;
		};
	};
	type CreateTodoReq = {
		userId?: number;
		title: string;
		description: string;
	};
}
