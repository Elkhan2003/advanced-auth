"use client";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { FC, ReactNode } from "react";

interface ILayoutClientProps {
	children: ReactNode;
}

const LayoutClient: FC<ILayoutClientProps> = ({ children }) => {
	return <ReactQueryProvider>{children}</ReactQueryProvider>;
};

export default LayoutClient;
