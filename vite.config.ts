import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

// The shared config supplies React, Tailwind, paths and TanStack's automatic
// route splitting. Add only deployment options and the local backend proxy.
const env = loadEnv("development", process.cwd(), "");
export default defineConfig({
  nitro: { preset: process.env.NITRO_PRESET || "node-server" },
  vite: {
    server: {
      host: "127.0.0.1",
      port: 5173,
      proxy: {
        "/api/v1": { target: env.API_PROXY_TARGET || "http://localhost:3001", changeOrigin: true },
      },
    },
  },
});
