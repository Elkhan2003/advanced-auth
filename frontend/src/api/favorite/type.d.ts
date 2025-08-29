namespace FAVORITE {
	type GetFavoriteRes = {
		success: boolean;
		data: Array<{
			id: number;
			userId: number;
			itemId: number;
		}>;
	};
	type GetFavoriteReq = void;

	type AddFavoriteRes = {
		success: boolean;
		data: {
			id: number;
			userId: number;
			itemId: number;
		};
	};
	type AddFavoriteReq = {
		itemId: number;
	};

	type DeleteFavoriteRes = {
		success: boolean;
		message: string;
	};
	type DeleteFavoriteReq = number;
}
