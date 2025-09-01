"use client";
import { FC } from "react";
import scss from "./ProfileMenu.module.scss";
import { useRouter } from "next/navigation";
import { useWindowSize } from "react-use";
import { useAuthStore } from "@/stores/useAuthStore";
import { link } from "@/utils/constants/route-links";
import Link from "next/link";
import { useGetMeQuery } from "@/api/user";

interface ProfileMenuProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

export const ProfileMenu: FC<ProfileMenuProps> = ({ isOpen, setIsOpen }) => {
	const router = useRouter();
	const { clearAuth, isAuthenticated } = useAuthStore();
	const { width } = useWindowSize();
	const { data: user } = useGetMeQuery({ enabled: isAuthenticated() });

	const handleLogout = () => {
		clearAuth();
		router.push("/sign-in");
	};

	return (
		<section
			className={
				isOpen ? `${scss.ProfileMenu} ${scss.active}` : `${scss.ProfileMenu}`
			}>
			<div className={scss.content}>
				<div className={scss.userInfo}>
					<h2>{user?.data?.fullName}</h2>
					<span>{user?.data?.email}</span>
				</div>
				<nav>
					<ul>
						{width <= 768 &&
							link.map((item, index) => (
								<li key={index}>
									<Link href={item.href}>{item.name}</Link>
								</li>
							))}
						<li>
							<Link href="/favorites">Избранное</Link>
						</li>
					</ul>
				</nav>
				<button onClick={handleLogout}>LogOut</button>
			</div>
		</section>
	);
};
