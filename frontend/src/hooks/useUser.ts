import { useState, useCallback } from "react";
import { useAuthStore } from "@store/authStore";
import { apiClient } from "@/http";
import { UserDTO } from "@/types/api";

export const useUser = () => {
	const { user } = useAuthStore();
	
	return {
		user,
	};
};

export const useUserMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { updateUser } = useAuthStore();

	const fetchProfile = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const user: UserDTO = await apiClient.user.getProfile();
			updateUser(user);
			return user;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch profile";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateUser]);

	const setLanguage = useCallback(async (languageId: number) => {
		setIsLoading(true);
		setError(null);
		try {
			const user: UserDTO = await apiClient.user.setLanguage(languageId);
			updateUser(user);
			return user;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to set language";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [updateUser]);

	return {
		fetchProfile,
		setLanguage,
		isLoading,
		error,
	};
};
