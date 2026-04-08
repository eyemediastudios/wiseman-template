import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  adapter: vercel({ output: 'static' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
  image: {
    domains: ["cdn.sanity.io"],
  },
});