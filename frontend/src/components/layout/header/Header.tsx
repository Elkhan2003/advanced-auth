"use client";
import { FC } from "react";
import scss from "./Header.module.scss";
import { useGetMeQuery, useSignOutMutation } from "@/api/user";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export const Header: FC = () => {
	const router = useRouter();
	const { user, isAuthenticated, clearAuth } = useAuthStore();
	const signOutMutation = useSignOutMutation();

	const { data: meData } = useGetMeQuery({
		enabled: isAuthenticated(),
	});

	const handleLogOut = async () => {
		try {
			await signOutMutation.mutateAsync();
		} catch (error) {
			clearAuth();
		}
		router.push("/sign-in");
	};

	return (
		<header className={scss.Header}>
			<div className="container">
				<div className={scss.content}>
					<h1>ElchoDev</h1>
					<div className={scss.authSection}>
						{isAuthenticated() && (meData?.success || user) ? (
							<div className={scss.userInfo}>
								<div className={scss.userDetails}>
									<span className={scss.userName}>
										{meData?.data?.fullName || user?.fullName}
									</span>
									<span className={scss.userEmail}>
										{meData?.data?.email || user?.email}
									</span>
									{(meData?.data?.age || user?.age) && (
										<span className={scss.userAge}>
											Возраст: {meData?.data?.age || user?.age}
										</span>
									)}
								</div>
								<button
									className={scss.logoutButton}
									onClick={handleLogOut}
									disabled={signOutMutation.isPending}>
									{signOutMutation.isPending ? "Выход..." : "Выйти"}
								</button>
							</div>
						) : (
							<div className={scss.authButtons}>
								<button
									className={scss.signUpButton}
									onClick={() => router.push("/sign-up")}>
									Регистрация
								</button>
								<button
									className={scss.signInButton}
									onClick={() => router.push("/sign-in")}>
									Вход
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</header>
	);
};
