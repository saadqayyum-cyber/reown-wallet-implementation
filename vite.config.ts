import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": {},
  },
  server: {
    allowedHosts: [
      "04f1-87-249-132-216.ngrok-free.app/", // Add your specific ngrok URL
      ".ngrok-free.app", // Or allow all ngrok-free.app subdomains
    ],
  },
});
