import path from "path"
import { defineConfig } from "vite";
// MAKE SURE THIS IS EXACTLY '@vitejs/plugin-react'
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // 'babel' is not present on the declared Options type; cast to any to avoid TS error
      // while still passing the desired babel config to the plugin.
      ...({ babel: { plugins: [["babel-plugin-react-compiler", {}]] } } as any),
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
