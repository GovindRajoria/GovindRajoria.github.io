import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Deployed as a GitHub user site (govindrajoria.github.io), which serves from
// the domain root, so no `base` path is needed.
export default defineConfig({
  plugins: [react(), tailwindcss()],
});
