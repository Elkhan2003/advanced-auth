import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";

// get-todo
const useGetTodosQuery = (params: TODO.GetTodosReq) => {
	return useQuery<TODO.GetTodosRes>({
		queryKey: ["todos"],
		queryFn: async () => {
			const response = await api.get(`/todo-prisma/get-all`);
			return response.data;
		},
		retryDelay: 100,
		enabled: params.enabled,
	});
};

// create-todo
const useCreateTodoMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<TODO.CreateTodoRes, Error, TODO.CreateTodoReq>({
		mutationFn: async (data) => {
			const { userId, ...todoData } = data;
			const response = await api.post(`/todo-prisma/create`, todoData);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["todos"],
			});
		},
	});
};

export { useGetTodosQuery, useCreateTodoMutation };
