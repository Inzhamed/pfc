<<<<<<< HEAD
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
=======
// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import tailwindcss from "@tailwindcss/vite"
import tsconfigPaths from "vite-tsconfig-paths"
import path from "path"
>>>>>>> origin/backend-malek

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
<<<<<<< HEAD
  base: '/',
  build: {
    outDir: 'dist',
  },
=======
>>>>>>> origin/backend-malek
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
<<<<<<< HEAD
      },
    },
  },
});
=======
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
>>>>>>> origin/backend-malek
