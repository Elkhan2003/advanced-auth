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

	// get-users-message
	type GetUsersMessageRes = {
		success: boolean;
		data: Array<{
			id: number;
			email: string;
			fullName?: string;
			age?: number;
			supabaseId?: string;
			createdAt: string;
			updatedAt: string;
		}>;
	};
	type GetUsersMessageReq = void;

	// get-private-message
	type GetPrivateMessageRes = {
		success: boolean;
		data: Array<{
			id: number;
			senderId: number;
			receiverId: number;
			message: string;
			createdAt: string;
			updatedAt: string;
		}>;
	};
	type GetPrivateMessageReq = number;

	// send-message
	type SendMessageToUserRes = {
		success: boolean;
		data: {
			id: number;
			senderId: number;
			receiverId: number;
			message: string;
			createdAt: string;
			updatedAt: string;
		};
	};
	type SendMessageToUserReq = {
		receiverId: number;
		message: string;
	};
}
