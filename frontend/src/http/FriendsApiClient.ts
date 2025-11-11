import { FriendDTO, FriendInviteDTO, FriendshipDTO } from "@/types/api";

import { BaseApiClient } from "./BaseApiClient";

export class FriendsApiClient extends BaseApiClient {
	async getFriends(): Promise<FriendDTO[]> {
		return this.get<FriendDTO[]>("/api/friends");
	}

	async removeFriend(friendId: number): Promise<void> {
		return this.delete<void>(`/api/friends/${friendId}`);
	}

	async createInvite(): Promise<FriendInviteDTO> {
		return this.post<FriendInviteDTO>("/api/friends/invite");
	}

	async acceptInvite(inviteId: number): Promise<FriendshipDTO> {
		return this.post<FriendshipDTO>(`/api/friends/invite/${inviteId}/accept`);
	}
}
