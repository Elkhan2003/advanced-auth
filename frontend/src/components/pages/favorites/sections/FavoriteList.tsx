"use client";
import { FC, useEffect, useState } from "react";
import scss from "./FavoriteList.module.scss";
import axios from "axios";
import { useGetFavoriteQuery } from "@/api/favorite";

export const FavoriteList: FC = () => {
	const [favoriteMovies, setFavoriteMovies] = useState<
		DETAILS.GetMovieDetailsRes[]
	>([]);
	const { data: favoriteIds } = useGetFavoriteQuery();

	const getFavoriteMoviesIds = async (ids: number[]) => {
		if (!ids) return;
		const results = [];
		for (const id of ids) {
			const response = await axios.get(
				`${process.env.NEXT_PUBLIC_TMDB_API}/3/movie/${id}`,
				{
					headers: {
						Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
					},
				}
			);
			results.push(response.data);
		}
		setFavoriteMovies(results as DETAILS.GetMovieDetailsRes[]);
	};

	useEffect(() => {
		if (favoriteIds?.data) {
			const itemIds = favoriteIds.data.map((fav) => fav.itemId);
			getFavoriteMoviesIds(itemIds);
		}
	}, [favoriteIds?.data]);

	return (
		<section className={scss.FavoriteList}>
			<div className="container">
				<div className={scss.content}>
					<h1>FavoriteList</h1>
					<div className={scss.movies}>
						{favoriteMovies.map((item, index) => (
							<div key={item.id} className={scss.movie}>
								<p>
									{index + 1}. {item.title}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
