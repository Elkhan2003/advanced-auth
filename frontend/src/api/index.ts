import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const api = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API}/api/v1`,
});

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().getAccessToken();
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
