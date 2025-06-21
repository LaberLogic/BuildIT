import path from "path";
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2024-11-01",
  modules: ["@element-plus/nuxt", "@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["@/assets/css/tailwind.scss"],

  tailwindcss: {
    viewer: false,
  },

  vite: {
    resolve: {
      alias: {
        shared: path.resolve(__dirname, "../shared/src"),
      },
    },
  },

  runtimeConfig: {
    NODE_ENV: process.env.NUXT_NODE_ENV,
    PORT: process.env.NUXT_PORT,

    public: {
      API_BASE_URL: process.env.NUXT_API_BASE_URL || "http://localhost:3001",
    },
  },
});
