import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
	accessToken: string | null;
	refreshToken: string | null;
	setTokens: (accessToken: string, refreshToken: string) => void;
	updateTokens: (accessToken: string, refreshToken: string) => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	clearAuth: () => void;
	isAuthenticated: () => boolean;
}

export const useAuthStore = create<IAuthStore>()(
	persist(
		(set, get) => ({
			accessToken: null,
			refreshToken: null,
			setTokens: (accessToken, refreshToken) => {
				set({ accessToken, refreshToken });
			},
			updateTokens: (accessToken, refreshToken) => {
				set({ accessToken, refreshToken });
			},
			getAccessToken: () => {
				return get().accessToken;
			},
			getRefreshToken: () => {
				return get().refreshToken;
			},
			clearAuth: () => {
				set({ accessToken: null, refreshToken: null });
			},
			isAuthenticated: () => {
				const { accessToken } = get();
				return !!accessToken;
			},
		}),
		{
			name: "auth_store",
			partialize: (state) => ({
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		}
	)
);
