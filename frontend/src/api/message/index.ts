import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "..";

// get-messages
const useGetMessagesQuery = (params: MESSAGE.GetMessagesReq) => {
	return useQuery<MESSAGE.GetMessagesRes>({
		queryKey: ["messages"],
		queryFn: async () => {
			const response = await api.get(`/message/get-all`);
			return response.data;
		},
		retryDelay: 100,
		enabled: params.enabled,
	});
};

// send-message
const useSendMessageMutation = () => {
	return useMutation<MESSAGE.SendMessageRes, Error, MESSAGE.SendMessageReq>({
		mutationFn: async (data) => {
			const response = await api.post(`/message/send`, data);
			return response.data;
		},
	});
};

export { useGetMessagesQuery, useSendMessageMutation };
