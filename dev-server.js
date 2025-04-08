// 簡單的臨時開發服務器
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startDevServer() {
  const vite = await createServer({
    root: path.resolve(__dirname, 'client'),
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    base: './',
    appType: 'spa',
    clearScreen: false,
    plugins: [
      react(),
      runtimeErrorOverlay(),
      themePlugin(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
  });

  await vite.listen();
  console.log(`Server is running at http://localhost:${vite.config.server.port}`);
}

startDevServer().catch((err) => {
  console.error('Error starting development server:', err);
  process.exit(1);
});