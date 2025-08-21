"use client";
import { FC } from "react";
import scss from "./Card.module.scss";
import { useParams } from "next/navigation";

export const Card: FC = () => {
	const { cardId } = useParams();

	return (
		<section className={scss.Card}>
			<div className="container">
				<div className={scss.content}>Card-ID: {cardId}</div>
			</div>
		</section>
	);
};
