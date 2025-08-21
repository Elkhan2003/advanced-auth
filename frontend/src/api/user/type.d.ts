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
	token_type: string;
	user: ISupabaseUser;
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
			user: ISupabaseUser;
			session: ISession;
			localUser: IUser;
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
			user: ISupabaseUser;
			session: ISession;
			localUser: IUser;
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
}
