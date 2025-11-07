import axios from "axios";

import { API_URL } from "@config/api";
import { useAuthStore } from "@store/authStore";

const $api = axios.create({
	baseURL: API_URL,
});

$api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

$api.interceptors.response.use(
	(config) => config,
	async (error) => {
		if (error.response?.status === 401) {
			useAuthStore.getState().clearAuth();
		}
		throw error;
	},
);

export default $api;
