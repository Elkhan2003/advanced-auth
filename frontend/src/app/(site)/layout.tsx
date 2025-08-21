import { LayoutSite } from "@/components/layout/LayoutSite";
import { FC, ReactNode } from "react";

interface ILayoutProps {
	children: ReactNode;
}

const layout: FC<ILayoutProps> = ({ children }) => {
	return <LayoutSite>{children}</LayoutSite>;
};
export default layout;
