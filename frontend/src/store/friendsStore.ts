import { create } from "zustand";

import { FriendDTO, FriendInviteDTO } from "@/types/api";

interface FriendsState {
	friends: FriendDTO[];
	invites: FriendInviteDTO[];
	isLoading: boolean;
	error: string | null;
	
	setFriends: (friends: FriendDTO[]) => void;
	addFriend: (friend: FriendDTO) => void;
	removeFriend: (friendId: number) => void;
	setInvites: (invites: FriendInviteDTO[]) => void;
	addInvite: (invite: FriendInviteDTO) => void;
	removeInvite: (inviteId: number) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearFriends: () => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
	friends: [],
	invites: [],
	isLoading: false,
	error: null,

	setFriends: (friends) => set({ friends, error: null }),
	
	addFriend: (friend) => set((state) => ({
		friends: [...state.friends, friend],
		error: null,
	})),
	
	removeFriend: (friendId) => set((state) => ({
		friends: state.friends.filter((f) => f.userId !== friendId),
		error: null,
	})),
	
	setInvites: (invites) => set({ invites, error: null }),
	
	addInvite: (invite) => set((state) => ({
		invites: [...state.invites, invite],
		error: null,
	})),
	
	removeInvite: (inviteId) => set((state) => ({
		invites: state.invites.filter((i) => i.inviteId !== inviteId),
		error: null,
	})),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearFriends: () => set({ 
		friends: [], 
		invites: [], 
		error: null, 
	}),
}));
