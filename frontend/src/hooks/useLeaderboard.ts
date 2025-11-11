import { useState, useCallback } from "react";
import { useLeaderboardStore } from "@store/leaderboardStore";
import { apiClient } from "@/http";
import { LeaderboardDTO, LeaderboardType } from "@/types/api";

export const useLeaderboard = () => {
	const { allLeaderboard, friendsLeaderboard, isLoading, error } = useLeaderboardStore();
	
	return {
		allLeaderboard,
		friendsLeaderboard,
		isLoading,
		error,
	};
};

export const useLeaderboardMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setLeaderboard } = useLeaderboardStore();

	const fetchLeaderboard = useCallback(async (type: LeaderboardType) => {
		setIsLoading(true);
		setError(null);
		useLeaderboardStore.getState().setLoading(true);
		try {
			const leaderboard: LeaderboardDTO = await apiClient.stats.getLeaderboard(type);
			setLeaderboard(type, leaderboard);
			return leaderboard;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch leaderboard";
			setError(errorMessage);
			useLeaderboardStore.getState().setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
			useLeaderboardStore.getState().setLoading(false);
		}
	}, [setLeaderboard]);

	return {
		fetchLeaderboard,
		isLoading,
		error,
	};
};
