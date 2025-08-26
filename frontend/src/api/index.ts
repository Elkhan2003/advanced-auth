import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

let isRefreshingToken = false;
let pendingRequests: Array<{
	resolve: (token: string) => void;
	reject: (error: any) => void;
}> = [];

const processPendingRequests = (error: any, newToken?: string) => {
	pendingRequests.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(newToken!);
		}
	});
	pendingRequests = [];
};

export const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API}/api/v1`,
});

export const api_tmdb = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_TMDB_API}/3`,
	headers: {
		Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
	},
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().getAccessToken();
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		const isUnauthorized = error.response?.status === 401;
		const isFirstAttempt = !originalRequest._retry;

		if (!isUnauthorized || !isFirstAttempt) {
			return Promise.reject(error);
		}

		if (isRefreshingToken) {
			return new Promise((resolve, reject) => {
				pendingRequests.push({
					resolve: (token) => {
						originalRequest.headers.Authorization = `Bearer ${token}`;
						resolve(api(originalRequest));
					},
					reject,
				});
			});
		}

		originalRequest._retry = true;
		isRefreshingToken = true;

		const { getRefreshToken, clearAuth, updateTokens } =
			useAuthStore.getState();
		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			clearAuth();
			window.location.href = "/sign-in";
			return Promise.reject(error);
		}

		try {
			const response = await api.post("/user/refresh-token", {
				refresh_token: refreshToken,
			});

			const { access_token, refresh_token: newRefreshToken } =
				response.data.data.session;

			updateTokens(access_token, newRefreshToken);
			processPendingRequests(null, access_token);

			originalRequest.headers.Authorization = `Bearer ${access_token}`;
			return api(originalRequest);
		} catch (refreshError) {
			processPendingRequests(refreshError);
			clearAuth();
			window.location.href = "/sign-in";
			return Promise.reject(refreshError);
		} finally {
			isRefreshingToken = false;
		}
	}
);
