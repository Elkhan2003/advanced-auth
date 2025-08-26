"use client";
import { FC } from "react";
import scss from "./PopularMovie.module.scss";
import { useGetPopularQuery } from "@/api/popular";
import { HeartPlus } from "lucide-react";
import { useAddFavoriteMutation, useGetFavoriteQuery } from "@/api/favorite";

export const PopularMovie: FC = () => {
	const { data: popularData } = useGetPopularQuery("movie");
	const { data: favoriteData, refetch: refetchFavorite } =
		useGetFavoriteQuery();
	const { mutateAsync: addFavoriteMutation } = useAddFavoriteMutation();

	const handleAddToFavorite = async (movieId: number) => {
		await addFavoriteMutation({ itemId: movieId });
		await refetchFavorite();
	};

	return (
		<section className={scss.PopularMovie}>
			<div className="container">
				<div className={scss.content}>
					<div className={scss.movies}>
						{popularData?.results.map((item) => (
							<div key={item.id} className={scss.item}>
								<div className={scss.header}>
									<img
										src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
										alt={item.title}
									/>
								</div>
								<div className={scss.footer}>
									<div className={scss.info}>
										<h3>{item.title}</h3>
										<span>Rating: {item.vote_average}</span>
										<span>Release Date: {item.release_date}</span>
									</div>
									<div className={scss.actions}>
										{favoriteData?.data.some(
											(fav) => fav.itemId === item.id
										) ? (
											<span className={scss.added}>Added to Favorites</span>
										) : (
											<button
												className={scss.btn}
												onClick={() => {
													handleAddToFavorite(item.id);
												}}>
												<HeartPlus size={50} />
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};
