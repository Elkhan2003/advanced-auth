namespace MESSAGE {
	// get-messages
	type GetMessagesRes = {
		success: boolean;
		data: Array<{
			id: number;
			userId: number;
			message: string;
			createdAt: string;
			updatedAt: string;
			user: {
				id: number;
				email: string;
				fullName?: string;
				age?: number;
				supabaseId?: string;
				createdAt: string;
				updatedAt: string;
			};
		}>;
	};
	type GetMessagesReq = void;

	// send-message
	type SendMessageRes = {
		success: boolean;
		data: {
			id: number;
			userId: number;
			message: string;
			createdAt: string;
			updatedAt: string;
		};
	};
	type SendMessageReq = {
		message: string;
	};
}
