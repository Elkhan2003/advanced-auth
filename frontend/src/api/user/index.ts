import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "..";
import { useAuthStore } from "../../stores/useAuthStore";

// get-me
const useGetMeQuery = (query: USER.GetMeReq) => {
	return useQuery<USER.GetMeRes>({
		queryKey: ["me"],
		queryFn: async () => {
			const response = await api.get(`/user/me`);
			return response.data;
		},
		enabled: query.enabled,
		retry: false,
		retryDelay: 100,
	});
};

// sign-in
const useSignInMutation = () => {
	const queryClient = useQueryClient();
	const { setTokens } = useAuthStore();
	return useMutation<USER.SignInRes, Error, USER.SignInReq>({
		mutationFn: async (data) => {
			const response = await api.post("/user/sign-in", data);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.success && data.data.session) {
				setTokens(
					data.data.session.access_token,
					data.data.session.refresh_token
				);
			}
			queryClient.invalidateQueries({
				queryKey: ["me"],
			});
		},
	});
};

// sign-up
const useSignUpMutation = () => {
	const queryClient = useQueryClient();
	return useMutation<USER.SignUpRes, Error, USER.SignUpReq>({
		mutationFn: async (data) => {
			const response = await api.post("/user/sign-up", data);
			return response.data;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: ["me"],
			});
		},
	});
};

// refresh-token
const useRefreshTokenMutation = () => {
	const { updateTokens, clearAuth } = useAuthStore();
	return useMutation<USER.RefreshTokenRes, Error, USER.RefreshTokenReq>({
		mutationFn: async (data) => {
			const response = await api.post("/user/refresh-token", data);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.success && data.data.session) {
				updateTokens(
					data.data.session.access_token,
					data.data.session.refresh_token
				);
			}
		},
		onError: () => {
			clearAuth();
		},
	});
};

// sign-out
const useSignOutMutation = () => {
	const queryClient = useQueryClient();
	const { clearAuth } = useAuthStore();
	return useMutation<USER.SignOutRes, Error, void>({
		mutationFn: async () => {
			const response = await api.post("/user/sign-out");
			return response.data;
		},
		onSuccess: () => {
			clearAuth();
			queryClient.clear();
		},
		onError: () => {
			clearAuth();
			queryClient.clear();
		},
	});
};

export {
	useGetMeQuery,
	useSignInMutation,
	useSignUpMutation,
	useRefreshTokenMutation,
	useSignOutMutation,
};
