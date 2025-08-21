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
		retryDelay: 100,
	});
};

// sign-in
const useSignInMutation = () => {
	const queryClient = useQueryClient();
	const { setAuth } = useAuthStore();
	
	return useMutation<USER.SignInRes, Error, USER.SignInReq>({
		mutationFn: async (data) => {
			const response = await api.post("/user/sign-in", data);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.success && data.data.session && data.data.localUser) {
				setAuth(
					data.data.localUser,
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
	const { setAuth } = useAuthStore();
	
	return useMutation<USER.SignUpRes, Error, USER.SignUpReq>({
		mutationFn: async (data) => {
			const response = await api.post("/user/sign-up", data);
			return response.data;
		},
		onSuccess: (data) => {
			if (data.success && data.data.session && data.data.localUser) {
				setAuth(
					data.data.localUser,
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

export { useGetMeQuery, useSignInMutation, useSignUpMutation, useSignOutMutation };
