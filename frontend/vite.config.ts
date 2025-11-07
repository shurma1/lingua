import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import path from "path";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const port = Number(env.VITE_PORT) || 3000;
	
	return {
		server: {
			port,
			allowedHosts: [".ngrok-free.app"],
		},
		plugins: [
			react(),
			createSvgIconsPlugin({
				iconDirs: [path.resolve(process.cwd(), "src/assets/icons")],
				symbolId: "icon-[name]",
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
				"@components": path.resolve(__dirname, "./src/components"),
				"@pages": path.resolve(__dirname, "./src/pages"),
				"@hooks": path.resolve(__dirname, "./src/hooks"),
				"@utils": path.resolve(__dirname, "./src/utils"),
				"@store": path.resolve(__dirname, "./src/store"),
				"@contexts": path.resolve(__dirname, "./src/contexts"),
				"@config": path.resolve(__dirname, "./src/config"),
				"@http": path.resolve(__dirname, "./src/http"),
				"@t": path.resolve(__dirname, "./src/types"),
				"@styles": path.resolve(__dirname, "./src/styles"),
				"@assets": path.resolve(__dirname, "./src/assets"),
				"@WebApp": path.resolve(__dirname, "./src/WebApp"),
			},
		},
	};
});
