import { FC, ReactNode, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter, usePathname } from "next/navigation";
import { useGetMeQuery, useRefreshTokenMutation } from "@/api/user";

interface ISessionProviderProps {
	children: ReactNode;
}

export const SessionProvider: FC<ISessionProviderProps> = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const { isAuthenticated, getRefreshToken, getAccessToken, clearAuth } =
		useAuthStore();
	const { status, refetch } = useGetMeQuery({
		enabled: isAuthenticated(),
	});

	const refreshTokenMutation = useRefreshTokenMutation();
	const isRefreshing = useRef(false);

	useEffect(() => {
		const publicRoutes = ["/sign-in", "/sign-up"];
		const isPublicRoute = publicRoutes.includes(pathname);
		if (!isAuthenticated() && !isPublicRoute) {
			router.push("/sign-in");
		} else if (isAuthenticated() && isPublicRoute) {
			router.push("/");
		}
	}, [isAuthenticated, pathname, router]);

	// Проверка и обновление токена при загрузке
	useEffect(() => {
		const checkTokenValidity = async () => {
			if (isRefreshing.current) return;

			const refreshToken = getRefreshToken();
			const accessToken = getAccessToken();

			if ((refreshToken && !accessToken) || status === "error") {
				if (!refreshToken) {
					clearAuth();
					router.push("/sign-in");
					return;
				}

				isRefreshing.current = true;
				try {
					await refreshTokenMutation.mutateAsync({
						refresh_token: refreshToken,
					});
					await refetch();
				} catch (error) {
					console.error("Failed to refresh token:", error);
					clearAuth();
					router.push("/sign-in");
				} finally {
					isRefreshing.current = false;
				}
			}
		};

		if (isAuthenticated()) {
			checkTokenValidity();
		}
	}, [status]);

	// Первичная проверка при монтировании
	useEffect(() => {
		const initialCheck = async () => {
			if (isRefreshing.current || !isAuthenticated()) return;

			const refreshToken = getRefreshToken();
			const accessToken = getAccessToken();

			if (refreshToken && !accessToken) {
				isRefreshing.current = true;
				try {
					await refreshTokenMutation.mutateAsync({
						refresh_token: refreshToken,
					});
				} catch (error) {
					console.error("Failed to refresh token:", error);
					clearAuth();
					router.push("/sign-in");
				} finally {
					isRefreshing.current = false;
				}
			}
		};

		initialCheck();
	}, []);

	return <>{children}</>;
};
