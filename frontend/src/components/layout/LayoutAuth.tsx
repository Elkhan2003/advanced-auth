"use client";
import { FC, ReactNode } from "react";

interface ILayoutAuthProps {
	children: ReactNode;
}

export const LayoutAuth: FC<ILayoutAuthProps> = ({ children }) => {
	return <>{children}</>;
};
