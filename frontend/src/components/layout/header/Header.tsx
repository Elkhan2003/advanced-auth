"use client";
import { FC, useState } from "react";
import scss from "./Header.module.scss";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import Link from "next/link";
import { link } from "@/utils/constants/route-links";
import { ProfileMenu } from "@/components/ui/profileMenu/ProfileMenu";
import { useWindowSize } from "react-use";
import { useGetMeQuery } from "@/api/user";

export const Header: FC = () => {
	const pathname = usePathname();
	const { width } = useWindowSize();
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated } = useAuthStore();
	const { data: user } = useGetMeQuery({ enabled: isAuthenticated() });

	return (
		<header className={scss.Header}>
			<div className="container">
				<div className={scss.content}>
					<div className={scss.logo}>
						<h1>ElchoDev</h1>
					</div>
					{width >= 768 && (
						<nav className={scss.nav}>
							<ul>
								{link.map((item, index) => (
									<li key={index}>
										<Link
											href={item.href}
											className={
												pathname === item.href
													? `${scss.link} ${scss.active}`
													: `${scss.link}`
											}>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>
					)}
					<div className={scss.authSection}>
						<button
							onClick={() => {
								setIsOpen(!isOpen);
							}}>
							{user?.data?.fullName}
						</button>
						<ProfileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
					</div>
				</div>
			</div>
		</header>
	);
};
