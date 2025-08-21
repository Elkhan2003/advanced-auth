"use client";
import { FC, useState } from "react";
import scss from "./SignInPage.module.scss";
import { useAuthStore } from "@/stores/useAuthStore";
import { useSignInMutation } from "@/api/user";
import { useRouter } from "next/navigation";

export const SignInPage: FC = () => {
	const router = useRouter();
	const { setAuth } = useAuthStore();
	const signInMutation = useSignInMutation();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const res = await signInMutation.mutateAsync(formData);
			if (res.success && res.data.session && res.data.localUser) {
				setAuth(
					res.data.localUser,
					res.data.session.access_token,
					res.data.session.refresh_token
				);
				router.push("/");
			}
		} catch (err: any) {
			console.error(err?.message || "Ошибка входа");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<section className={scss.SignInPage}>
			<div className="container">
				<div className={scss.content}>
					<h1>Вход</h1>
					<form onSubmit={handleSubmit} className={scss.form}>
						<div className={scss.inputGroup}>
							<label htmlFor="email">Email:</label>
							<input
								type="email"
								id="email"
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className={scss.inputGroup}>
							<label htmlFor="password">Пароль:</label>
							<input
								type="password"
								id="password"
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								required
							/>
						</div>
						<button
							type="submit"
							className={scss.submitButton}
							disabled={signInMutation.isPending}>
							{signInMutation.isPending ? "Входим..." : "Войти"}
						</button>
						{signInMutation.error && (
							<div className={scss.error}>
								Ошибка: {signInMutation.error.message}
							</div>
						)}
					</form>
				</div>
			</div>
		</section>
	);
};
