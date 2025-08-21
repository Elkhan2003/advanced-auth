import { FC, ReactNode } from "react";
import { LayoutAuth } from "@/components/layout/LayoutAuth";

interface ILayoutProps {
	children: ReactNode;
}

const layout: FC<ILayoutProps> = ({ children }) => {
	return <LayoutAuth>{children}</LayoutAuth>;
};
export default layout;
