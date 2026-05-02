import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false },
    // proxy: {
    //   '/api': {
    //     target: 'https://tanjartmarket.com/backend',
    //     changeOrigin: true,
    //   },
    //   '/uploads': {
    //     target: 'https://tanjartmarket.com/backend',
    //     changeOrigin: true,
    //   },
    // },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'favicon.ico'],
      manifest: {
        name: 'Tanjartmarket',
        short_name: 'Tanjartmarket',
        description: 'أول منصة إلكترونية للمواد الغذائية في المغرب',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: '/launchericon-192x192.png',       // ← your logo filename
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/launchericon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/launchericon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^http:\/\/tanjartmarket\.test\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));