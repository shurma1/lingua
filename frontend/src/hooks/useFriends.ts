import { useState, useCallback } from "react";

import { useFriendsStore } from "@store/friendsStore";

import { apiClient } from "@/http";
import { FriendDTO, FriendInviteDTO, FriendshipDTO } from "@/types/api";

export const useFriends = () => {
	const { friends, invites, isLoading, error } = useFriendsStore();
	
	return {
		friends,
		invites,
		isLoading,
		error,
	};
};

export const useFriendsMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setFriends, removeFriend, addInvite, removeInvite } = useFriendsStore();

	const fetchFriends = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		useFriendsStore.getState().setLoading(true);
		try {
			const friends: FriendDTO[] = await apiClient.friends.getFriends();
			setFriends(friends);
			return friends;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch friends";
			setError(errorMessage);
			useFriendsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useFriendsStore.getState().setLoading(false);
		}
	}, [setFriends]);

	const deleteFriend = useCallback(async (friendId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			await apiClient.friends.removeFriend(friendId);
			removeFriend(friendId);
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to remove friend";
			setError(errorMessage);
			useFriendsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeFriend]);

	const createInvite = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const invite: FriendInviteDTO = await apiClient.friends.createInvite();
			addInvite(invite);
			return invite;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to create invite";
			setError(errorMessage);
			useFriendsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [addInvite]);

	const acceptInvite = useCallback(async (inviteId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const friendship: FriendshipDTO = await apiClient.friends.acceptInvite(inviteId);
			removeInvite(inviteId);
			// Refetch friends to update the list
			await fetchFriends();
			return friendship;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to accept invite";
			setError(errorMessage);
			useFriendsStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [removeInvite, fetchFriends]);

	return {
		fetchFriends,
		deleteFriend,
		createInvite,
		acceptInvite,
		isLoading,
		error,
	};
};
