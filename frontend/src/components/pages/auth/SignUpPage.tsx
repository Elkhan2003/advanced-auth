"use client";
import { FC } from "react";
import scss from "./SignUpPage.module.scss";
import { useSignUpMutation } from "@/api/user";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useForm } from "@tanstack/react-form";

export const SignUpPage: FC = () => {
	const router = useRouter();
	const signUpMutation = useSignUpMutation();

	const form = useForm({
		defaultValues: {
			email: "",
			password: "",
			fullName: "",
			age: 0,
		},
		onSubmit: async ({ value }) => {
			try {
				const res = await signUpMutation.mutateAsync(value);
				if (res.success) {
					toast.success(
						"Регистрация успешна! Проверьте почту для подтверждения."
					);
					router.push("/sign-in");
				}
			} catch (err: any) {
				const errorMessage =
					err?.response?.data?.message || "Ошибка регистрации";
				toast.error(errorMessage);
			}
		},
	});

	return (
		<section className={scss.SignUpPage}>
			<div className="container">
				<div className={scss.content}>
					<h1>Регистрация</h1>
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

						<form.Field
							name="fullName"
							validators={{
								onChange: ({ value }) => {
									if (!value) return "Имя обязательно";
									if (value.length < 2) return "Минимум 2 символа";
									return undefined;
								},
							}}>
							{(field) => (
								<div className={scss.inputGroup}>
									<label htmlFor={field.name}>Полное имя:</label>
									<input
										type="text"
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
							name="age"
							validators={{
								onChange: ({ value }) => {
									if (!value || value === 0) return "Возраст обязателен";
									if (value < 1 || value > 120)
										return "Возраст должен быть от 1 до 120";
									return undefined;
								},
							}}>
							{(field) => (
								<div className={scss.inputGroup}>
									<label htmlFor={field.name}>Возраст:</label>
									<input
										type="number"
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(Number(e.target.value))}
										required
										min="1"
										max="120"
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
									disabled={!canSubmit || signUpMutation.isPending}>
									{signUpMutation.isPending || isSubmitting
										? "Регистрация..."
										: "Зарегистрироваться"}
								</button>
							)}
						</form.Subscribe>

						{signUpMutation.error && (
							<div className={scss.error}>
								Ошибка: {signUpMutation.error.message}
							</div>
						)}
					</form>
				</div>
			</div>
		</section>
	);
};
