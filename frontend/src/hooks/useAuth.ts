import { useState, useEffect, useCallback } from "react";

import { useAuthStore } from "@store/authStore";

import { apiClient } from "@/http";
import { AuthResponseDTO, UserDTO } from "@/types/api";

// Main hook that returns both state and mutations
export const useAuth = () => {
	const { accessToken, user, isAuthenticated } = useAuthStore();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setAuth, clearAuth } = useAuthStore();

	// Setup auth token on apiClient whenever token changes
	useEffect(() => {
		const token = useAuthStore.getState().accessToken;
		apiClient.setAuthToken(token);
	}, [useAuthStore.getState().accessToken]);

	const authenticate = useCallback(async (initData: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const response: AuthResponseDTO = await apiClient.auth.authenticate(initData);
			setAuth(response.accessToken, response.user);
			apiClient.setAuthToken(response.accessToken);
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Authentication failed";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setAuth]);

	const getMe = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const user: UserDTO = await apiClient.auth.getMe();
			const currentToken = useAuthStore.getState().accessToken;
			if (currentToken) {
				setAuth(currentToken, user);
			}
			return user;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to get user info";
			setError(errorMessage);
			
			// Handle 401 errors by clearing auth
			if (err && typeof err === "object" && "response" in err) {
				const axiosError = err as { response?: { status?: number } };
				if (axiosError.response?.status === 401) {
					clearAuth();
					apiClient.setAuthToken(null);
				}
			}
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setAuth, clearAuth]);

	const logout = useCallback(() => {
		clearAuth();
		apiClient.setAuthToken(null);
	}, [clearAuth]);

	return {
		// State
		accessToken,
		user,
		isAuthenticated,
		isLoading,
		error,
		// Mutations
		authenticate,
		getMe,
		logout,
	};
};

// Separate hook for just mutations (optional, for components that only need mutations)
export const useAuthMutations = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { setAuth, clearAuth } = useAuthStore();

	// Setup auth token on apiClient whenever token changes
	useEffect(() => {
		const token = useAuthStore.getState().accessToken;
		apiClient.setAuthToken(token);
	}, [useAuthStore.getState().accessToken]);

	const authenticate = useCallback(async (initData: string) => {
		setIsLoading(true);
		setError(null);
		try {
			const response: AuthResponseDTO = await apiClient.auth.authenticate(initData);
			setAuth(response.accessToken, response.user);
			apiClient.setAuthToken(response.accessToken);
			return response;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Authentication failed";
			setError(errorMessage);
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setAuth]);

	const getMe = useCallback(async () => {
		setIsLoading(true);
		setError(null);
		try {
			const user: UserDTO = await apiClient.auth.getMe();
			const currentToken = useAuthStore.getState().accessToken;
			if (currentToken) {
				setAuth(currentToken, user);
			}
			return user;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to get user info";
			setError(errorMessage);
			
			// Handle 401 errors by clearing auth
			if (err && typeof err === "object" && "response" in err) {
				const axiosError = err as { response?: { status?: number } };
				if (axiosError.response?.status === 401) {
					clearAuth();
					apiClient.setAuthToken(null);
				}
			}
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [setAuth, clearAuth]);

	const logout = useCallback(() => {
		clearAuth();
		apiClient.setAuthToken(null);
	}, [clearAuth]);

	return {
		authenticate,
		getMe,
		logout,
		isLoading,
		error,
	};
};
