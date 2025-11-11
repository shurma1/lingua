import { create } from "zustand";

import { UserDTO } from "@/types/api";

interface AuthState {
	accessToken: string | null;
	user: UserDTO | null;
	isAuthenticated: boolean;
	setAuth: (accessToken: string, user: UserDTO) => void;
	clearAuth: () => void;
	updateUser: (user: UserDTO) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
	accessToken: null,
	user: null,
	isAuthenticated: false,
	setAuth: (accessToken, user) => set({
		accessToken,
		user,
		isAuthenticated: true,
	}),
	clearAuth: () => set({
		accessToken: null,
		user: null,
		isAuthenticated: false,
	}),
	updateUser: (user) => set((state) => ({
		...state,
		user,
	})),
}));
