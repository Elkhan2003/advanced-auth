import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});
	
	failedQueue = [];
};

export const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API}/api/v1`,
});

api.interceptors.request.use(
	(config) => {
		const token = useAuthStore.getState().getAccessToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then(token => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return api(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const { getRefreshToken, clearAuth } = useAuthStore.getState();
			const refreshToken = getRefreshToken();

			if (!refreshToken) {
				clearAuth();
				window.location.href = '/sign-in';
				return Promise.reject(error);
			}

			try {
				const response = await api.post('/user/refresh-token', {
					refresh_token: refreshToken
				});

				const { access_token, refresh_token: newRefreshToken } = response.data.data.session;

				useAuthStore.getState().updateTokens(access_token, newRefreshToken);

				processQueue(null, access_token);

				originalRequest.headers.Authorization = `Bearer ${access_token}`;
				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				useAuthStore.getState().clearAuth();
				window.location.href = '/sign-in';
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		return Promise.reject(error);
	}
);
