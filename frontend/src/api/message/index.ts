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

// get-users-message
const useGetUsersMessageQuery = (params: MESSAGE.GetUsersMessageReq) => {
	return useQuery<MESSAGE.GetUsersMessageRes>({
		queryKey: ["/message/get-users"],
		queryFn: async () => {
			const response = await api.get(`/message/get-users`);
			return response.data;
		},
	});
};

// get-private-message
const useGetPrivateMessageQuery = (id: MESSAGE.GetPrivateMessageReq) => {
	return useQuery<MESSAGE.GetPrivateMessageRes>({
		queryKey: [`/message/get-message/${id}`],
		queryFn: async () => {
			const response = await api.get(`/message/get-message/${id}`);
			return response.data;
		},
	});
};

// send-message-to-user
const useSendMessageToUserMutation = () => {
	return useMutation<
		MESSAGE.SendMessageToUserRes,
		Error,
		MESSAGE.SendMessageToUserReq
	>({
		mutationFn: async (data) => {
			const response = await api.post(`/message/send-to-user`, {
				receiverId: data.receiverId,
				message: data.message,
			});
			return response.data;
		},
	});
};

export {
	useGetMessagesQuery,
	useSendMessageMutation,
	useGetUsersMessageQuery,
	useGetPrivateMessageQuery,
	useSendMessageToUserMutation,
};
