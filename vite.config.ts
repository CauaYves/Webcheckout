import path from "node:path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

const API_TARGET = "https://dev-tst-multiclubes.multiclubes.com.br";

// https://vite.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		proxy: {
			"/api": {
				target: API_TARGET,
				changeOrigin: true,
				followRedirects: true,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},
	plugins: [
		// TanStack Router must come before React plugin
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		react(),
		babel({ presets: [reactCompilerPreset()] }),
		tailwindcss(),
	],
});
