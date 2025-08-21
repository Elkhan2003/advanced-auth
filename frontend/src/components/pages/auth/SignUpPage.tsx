"use client";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import scss from "./SignUpPage.module.scss";
import { useSignUpMutation } from "../../../api/user";

export const SignUpPage: FC = () => {
	const router = useRouter();
	const signUpMutation = useSignUpMutation();
	
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		fullName: "",
		age: 0
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await signUpMutation.mutateAsync(formData);
			router.push("/");
		} catch (error) {
			console.error("Registration failed:", error);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: name === "age" ? Number(value) : value
		}));
	};

	return (
		<section className={scss.SignUpPage}>
			<div className="container">
				<div className={scss.content}>
					<h1>Регистрация</h1>
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
						<div className={scss.inputGroup}>
							<label htmlFor="fullName">Полное имя:</label>
							<input
								type="text"
								id="fullName"
								name="fullName"
								value={formData.fullName}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className={scss.inputGroup}>
							<label htmlFor="age">Возраст:</label>
							<input
								type="number"
								id="age"
								name="age"
								value={formData.age}
								onChange={handleInputChange}
								required
								min="1"
							/>
						</div>
						<button 
							type="submit" 
							className={scss.submitButton}
							disabled={signUpMutation.isPending}
						>
							{signUpMutation.isPending ? "Регистрация..." : "Зарегистрироваться"}
						</button>
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
