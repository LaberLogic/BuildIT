import path from 'path'
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: ["@element-plus/nuxt", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/css/tailwind.scss"],
  tailwindcss: {
    viewer: false,
  },
  nitro: {
    devProxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        prependPath: false,
      },
    },
  },
  vite: {
    resolve: {
      alias: {
        'shared': path.resolve(__dirname, '../shared/src'),
      },
    },
  },
});
