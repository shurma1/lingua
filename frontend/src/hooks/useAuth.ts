import { useState, useEffect } from "react";

import axios from "axios";

import { API_URL } from "@config/api";
import { useAuthStore } from "@store/authStore";
import { AuthResponse } from "@/types/auth";
import WebApp from "@WebApp/WebApp";

export const useAuth = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();

	useEffect(() => {
		const authenticate = async () => {
			try {
				const initData = WebApp.initData;
				
				if (!initData) {
					throw new Error("WebApp initData not found");
				}

				const response = await axios.post<AuthResponse>(
					`${API_URL}/auth`,
					{ initData },
				);

				const { accessToken, user } = response.data;
				setAuth(accessToken, user);
				setError(null);
			} catch (err) {
				console.error("Authentication failed:", err);
				setError(err instanceof Error ? err.message : "Authentication failed");
				clearAuth();
			} finally {
				setIsLoading(false);
			}
		};

		authenticate();
	}, [setAuth, clearAuth]);

	return {
		isLoading,
		error,
		isAuthenticated,
		user,
	};
};
