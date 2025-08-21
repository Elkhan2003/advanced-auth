import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IAuthStore {
	user: IUser | null;
	accessToken: string | null;
	refreshToken: string | null;
	setAuth: (user: IUser, accessToken: string, refreshToken: string) => void;
	updateTokens: (accessToken: string, refreshToken: string) => void;
	getAccessToken: () => string | null;
	getRefreshToken: () => string | null;
	clearAuth: () => void;
	isAuthenticated: () => boolean;
}

type IUser = {
	id: number;
	email: string;
	fullName: string;
	age: number;
	supabaseId: string;
};

export const useAuthStore = create<IAuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			accessToken: null,
			refreshToken: null,
			setAuth: (user, accessToken, refreshToken) => {
				set({ user, accessToken, refreshToken });
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
				set({ user: null, accessToken: null, refreshToken: null });
			},
			isAuthenticated: () => {
				const { accessToken } = get();
				return !!accessToken;
			},
		}),
		{
			name: "auth_store",
			partialize: (state) => ({
				user: state.user,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken,
			}),
		}
	)
);
