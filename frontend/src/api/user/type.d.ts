type IUser = {
	id: number;
	email: string;
	fullName: string;
	age: number;
	supabaseId: string;
};

type ISupabaseUser = {
	id: string;
	email: string;
	user_metadata: {
		full_name?: string;
		age?: number;
	};
};

type ISession = {
	access_token: string;
	refresh_token: string;
	expires_at: number;
	expires_in: number;
	token_type: string;
};

namespace USER {
	// get-me
	type GetMeRes = {
		success: boolean;
		data: IUser;
	};
	type GetMeReq = {
		enabled?: boolean;
	};

	// sign-in
	type SignInRes = {
		success: boolean;
		data: {
			user: IUser;
			session: ISession;
		};
	};
	type SignInReq = {
		email: string;
		password: string;
	};

	// sign-up
	type SignUpRes = {
		success: boolean;
		data: {
			success: boolean;
			message: string;
			user: IUser;
		};
	};
	type SignUpReq = {
		email: string;
		password: string;
		fullName: string;
		age: number;
	};

	// sign-out
	type SignOutRes = {
		success: boolean;
		message: string;
	};

	// refresh-token
	type RefreshTokenRes = {
		success: boolean;
		data: {
			session: ISession;
			user: ISupabaseUser;
		};
	};
	type RefreshTokenReq = {
		refresh_token: string;
	};
}
