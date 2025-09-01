"use client";
import { FC } from "react";
import scss from "./SignInPage.module.scss";
import { useSignInMutation } from "@/api/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";

export const SignInPage: FC = () => {
	const router = useRouter();
	const signInMutation = useSignInMutation();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: async ({ value }) => {
			try {
				const res = await signInMutation.mutateAsync(value);
				if (res.success) {
					toast.success("Успешный вход!");
					router.push("/");
				}
			} catch (err: any) {
				const errorMessage = err?.response?.data?.message;
				if (errorMessage.includes("Email not confirmed")) {
					toast.error("Подтвердите email адрес. Проверьте почту!", {
						duration: 5000,
					});
				} else {
					toast.error(errorMessage);
				}
			}
		},
	});

	return (
		<section className={scss.SignInPage}>
			<div className="container">
				<div className={scss.content}>
					<h1>Вход</h1>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className={scss.form}>
						<form.Field
							name="email"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Email обязателен";
									if (!value.includes("@")) return "Некорректный email";
									return undefined;
								},
							}}>
							{(field) => (
								<div className={scss.inputGroup}>
									<label htmlFor={field.name}>Email:</label>
									<input
										type="email"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
									/>
									{field.state.meta.errors && (
										<div className={scss.fieldError}>
											{field.state.meta.errors}
										</div>
									)}
								</div>
							)}
						</form.Field>

						<form.Field
							name="password"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Пароль обязателен";
									if (value.length < 6) return "Минимум 6 символов";
									return undefined;
								},
							}}>
							{(field) => (
								<div className={scss.inputGroup}>
									<label htmlFor={field.name}>Пароль:</label>
									<input
										type="password"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										required
									/>
									{field.state.meta.errors && (
										<div className={scss.fieldError}>
											{field.state.meta.errors}
										</div>
									)}
								</div>
							)}
						</form.Field>

						<form.Subscribe
							selector={(state) => [state.canSubmit, state.isSubmitting]}>
							{([canSubmit, isSubmitting]) => (
								<button
									type="submit"
									className={scss.submitButton}
									disabled={!canSubmit || signInMutation.isPending}>
									{signInMutation.isPending || isSubmitting
										? "Входим..."
										: "Войти"}
								</button>
							)}
						</form.Subscribe>

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
