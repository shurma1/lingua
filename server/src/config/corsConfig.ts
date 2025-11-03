import type cors from "cors";

export const corsConfig = (isDev: boolean): cors.CorsOptions => {
	return {
		origin: isDev || ['https://reassel.com/'],
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization']
	}
}
