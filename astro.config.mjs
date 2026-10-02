import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://myahsits.com",
  base: "/",
  output: "static",
  adapter: vercel(),
});
